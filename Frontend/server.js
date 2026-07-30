import fs from 'node:fs/promises'
import zlib from 'node:zlib'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

// Constants
const lifecycleEvent = process.env.npm_lifecycle_event
const isProduction =
  process.env.NODE_ENV === 'production' ||
  lifecycleEvent === 'start' ||
  lifecycleEvent === 'preview'
const port = process.env.PORT || 3001
const base = process.env.BASE || '/'
const trustProxy = process.env.TRUST_PROXY === 'true'
const menuUpstreamBaseUrl = (
  process.env.WEBAPP_BASE_URL || 'https://omd.a2hosted.com'
).replace(/\/+$/, '')
const menuUpstreamApiToken = process.env.WEBAPP_API_TOKEN || ''
const menuCacheTtlMs = Number(process.env.MENU_CACHE_TTL_MS || 300_000)
const menuCategoryNames = new Map([
  [10, 'Breakfast'],
  [11, 'Lunch'],
  [12, 'Dinner'],
  [17, 'Dessert'],
  [15, 'Drinks'],
])
let publicMenuCache
let publicMenuCacheExpiresAt = 0
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

if (trustProxy) {
  // Enable only when requests always arrive through a trusted reverse proxy.
  app.set('trust proxy', 1)
}

app.disable('x-powered-by')
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            connectSrc: ["'self'", 'https:'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
)

const pageLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  limit: Number(process.env.RATE_LIMIT_REQUESTS || 120),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests. Please try again later.',
  skip: (req) => {
    const hostname = req.hostname.toLowerCase()
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true
    }

    // Missing or uncached asset requests can reach this middleware after the
    // static handler. They should never consume the HTML page quota.
    return /\.(?:avif|css|gif|ico|jpe?g|js|json|map|mov|mp4|png|svg|webm|webp|woff2?)$/i.test(
      req.path
    )
  },
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

function getPublicImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return ''
  }

  try {
    const pathname = imageUrl.startsWith('http')
      ? new URL(imageUrl).pathname
      : `/public/storage/${imageUrl.replace(/^\/+/, '')}`

    // Product images are served through the restricted Nginx media proxy.
    return `/media/${pathname.replace(/^\/+/, '')}`
  } catch {
    return ''
  }
}

function buildPublicMenu(products) {
  const items = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Dessert: [],
    Drinks: [],
  }

  for (const product of products) {
    if (!product || typeof product !== 'object') continue

    const categoryIds = Array.isArray(product.categories)
      ? product.categories.map((category) => Number(category?.id))
      : []
    const publicProduct = {
      // Deliberately allowlist display-safe fields. Do not spread raw products.
      name: typeof product.name === 'string' ? product.name : '',
      name_kh: typeof product.name_kh === 'string' ? product.name_kh : '',
      price: Number.isFinite(Number(product.price))
        ? `USD ${Number(product.price).toFixed(2)}`
        : '',
      desc:
        typeof product.description === 'string' &&
        !['NULL', 'null'].includes(product.description)
          ? product.description
          : '',
      img: getPublicImageUrl(product.image_url),
      badge:
        product.is_out_of_stock === '1' ||
        (Array.isArray(product.menu_out_of_stock) &&
          product.menu_out_of_stock.length > 0)
          ? 'Out of Stock'
          : undefined,
    }

    for (const categoryId of categoryIds) {
      const categoryName = menuCategoryNames.get(categoryId)
      if (categoryName) {
        items[categoryName].push({
          ...publicProduct,
          category: categoryName.toUpperCase(),
        })
      }
    }
  }

  return {
    hero: {
      title: 'Our Menu',
      subtitle:
        'Traditional Cambodian flavors served with modern warmth and refined presentation.',
      backgroundImage: '@/assets/home-v2/boeung-kak-exterior.webp',
    },
    categories: Object.keys(items),
    items,
  }
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

// Public, read-only projection of the upstream menu. The browser never receives
// the upstream response or internal fields that are not explicitly allowlisted.
app.get('/api/public-menu', async (_req, res) => {
  try {
    if (publicMenuCache && Date.now() < publicMenuCacheExpiresAt) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
      res.json(publicMenuCache)
      return
    }

    const upstreamResponse = await fetch(
      `${menuUpstreamBaseUrl}/api/website/products`,
      {
        headers: {
          Accept: 'application/json',
          ...(menuUpstreamApiToken
            ? {
                Authorization: `Bearer ${menuUpstreamApiToken}`,
              }
            : {}),
        },
        signal: AbortSignal.timeout(10_000),
      }
    )
    if (!upstreamResponse.ok) {
      throw new Error(`Menu upstream returned ${upstreamResponse.status}`)
    }

    const upstreamPayload = await upstreamResponse.json()
    const products = Array.isArray(upstreamPayload?.data)
      ? upstreamPayload.data
      : []
    publicMenuCache = buildPublicMenu(products)
    publicMenuCacheExpiresAt = Date.now() + menuCacheTtlMs

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json(publicMenuCache)
  } catch (error) {
    console.error('Unable to load public menu:', error)
    res.status(502).json({ message: 'Menu is temporarily unavailable.' })
  }
})

// Static assets are handled above and do not consume the page-request quota.
// This prevents image-heavy gallery/menu pages from rate-limiting themselves.
app.use(pageLimiter)

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
    console.error(e)
    res.status(500).end(
      isProduction ? 'Internal Server Error' : e.stack
    )
  }
})

// Start http server
export const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
