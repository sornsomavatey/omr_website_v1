import fs from 'node:fs/promises'
import express from 'express'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3001
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

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
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url =
      base !== '/' && req.originalUrl.startsWith(base)
        ? req.originalUrl.slice(base.length - 1) || '/'
        : req.originalUrl

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

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
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
