import fs from 'node:fs/promises'
import zlib from 'node:zlib'
import express from 'express'

// Constants
const lifecycleEvent = process.env.npm_lifecycle_event
const isProduction =
  process.env.NODE_ENV === 'production' ||
  lifecycleEvent === 'start' ||
  lifecycleEvent === 'preview'
const port = process.env.PORT || 3001
const base = process.env.BASE || '/'
const legacyRedirects = new Map([
  ['/restaurants', '/branches'],
  ['/restaurants/toul-kork', '/branches/toul-kork'],
  ['/restaurants/boeung-kak', '/branches/boeung-kak'],
])
const renderedRoutes = new Set([
  '/',
  '/menu',
  '/branches',
  '/branches/toul-kork',
  '/branches/boeung-kak',
  '/gallery',
  '/events',
  '/about',
  '/careers',
  '/contact',
  '/terms',
  '/reservation',
  '/reservations',
])

function addBase(path) {
  return base === '/' ? path : `${base.replace(/\/$/, '')}${path}`
}

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Rate Limiting & Security Headers Middleware to block request loops
const ipRequestCounts = new Map()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 100 // max 100 requests per minute per IP

// Periodically clean up stale rate-limiting records to avoid memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      ipRequestCounts.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW_MS)

app.use((req, res, next) => {
  // 1. Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 2. Rate Limiting (Block request loop abuse)
  const clientIp = (req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '127.0.0.1').trim()
  const now = Date.now()

  let record = ipRequestCounts.get(clientIp)
  if (!record || (now - record.startTime > RATE_LIMIT_WINDOW_MS)) {
    record = { count: 1, startTime: now }
    ipRequestCounts.set(clientIp, record)
  } else {
    record.count += 1
  }

  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.startTime)) / 1000)
    res.setHeader('Retry-After', retryAfterSeconds)
    return res.status(429).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><title>429 Too Many Requests</title></head>
      <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
        <h2>429 - Rate Limit Exceeded</h2>
        <p>Too many requests detected. Please wait ${retryAfterSeconds} seconds before trying again.</p>
      </body>
      </html>
    `)
  }

  next()
})

function sendHtml(req, res, html) {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    Vary: 'Accept-Encoding',
  }
  const acceptedEncoding = req.headers['accept-encoding'] || ''

  if (acceptedEncoding.includes('br')) {
    res.status(200).set({ ...headers, 'Content-Encoding': 'br' })
    res.send(zlib.brotliCompressSync(Buffer.from(html)))
    return
  }

  if (acceptedEncoding.includes('gzip')) {
    res.status(200).set({ ...headers, 'Content-Encoding': 'gzip' })
    res.send(zlib.gzipSync(Buffer.from(html)))
    return
  }

  res.status(200).set(headers).send(html)
}

// Add Vite 
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  app.use(base, express.static('./dist/client', { index: false }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url =
      base !== '/' && req.originalUrl.startsWith(base)
        ? req.originalUrl.slice(base.length - 1) || '/'
        : req.originalUrl
    const parsedUrl = new URL(url, 'http://localhost')
    const pathname =
      parsedUrl.pathname.length > 1
        ? parsedUrl.pathname.replace(/\/+$/, '')
        : parsedUrl.pathname
    const legacyDestination = legacyRedirects.get(pathname)

    if (legacyDestination) {
      res.redirect(301, `${addBase(legacyDestination)}${parsedUrl.search}`)
      return
    }

    if (!renderedRoutes.has(pathname)) {
      res.redirect(302, addBase('/'))
      return
    }

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.tsx').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)

    let html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    // Dynamically inject server-rendered SEO Title
    if (rendered.title) {
      html = html.replace(/<title>.*?<\/title>/, `<title>${rendered.title}</title>`)
    }

    // Dynamically inject server-rendered SEO Description
    if (rendered.description) {
      html = html.replace(
        /<meta name="description" content=".*?"\s*\/?>/,
        `<meta name="description" content="${rendered.description}" />`
      )
    }

    // Dynamically inject server-rendered SEO Keywords
    if (rendered.keywords) {
      html = html.replace(
        /<meta name="keywords" content=".*?"\s*\/?>/,
        `<meta name="keywords" content="${rendered.keywords}" />`
      )
    }

    // Dynamically inject server-rendered Open Graph & Twitter Title
    if (rendered.title) {
      html = html
        .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${rendered.title}" />`)
        .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${rendered.title}" />`)
    }

    // Dynamically inject server-rendered Open Graph & Twitter Description
    if (rendered.description) {
      html = html
        .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${rendered.description}" />`)
        .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${rendered.description}" />`)
    }

    // Dynamically inject server-rendered Open Graph & Twitter Image
    if (rendered.ogImage) {
      html = html
        .replace(/<meta property="og:image" content=".*?"\s*\/?>/, `<meta property="og:image" content="${rendered.ogImage}" />`)
        .replace(/<meta name="twitter:image" content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${rendered.ogImage}" />`)
    }

    // Dynamically inject server-rendered URL
    const domain = 'https://onemorerestaurant.com';
    const fullUrl = `${domain}/${url.replace(/^\//, '')}`;
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${fullUrl}" />`)

    sendHtml(req, res, html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
