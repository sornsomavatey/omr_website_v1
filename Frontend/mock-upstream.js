import express from 'express'
import { timingSafeEqual } from 'node:crypto'

const app = express()
const port = 4000
const expectedToken = process.env.WEBAPP_API_TOKEN || ''

if (!expectedToken) {
  throw new Error('WEBAPP_API_TOKEN is missing from .env')
}

function tokensMatch(receivedToken, correctToken) {
  const received = Buffer.from(receivedToken)
  const correct = Buffer.from(correctToken)

  return (
    received.length === correct.length &&
    timingSafeEqual(received, correct)
  )
}

function requireToken(req, res, next) {
  const authorization = req.get('Authorization') || ''
  const bearerPrefix = 'Bearer '

  if (!authorization.startsWith(bearerPrefix)) {
    console.warn('Rejected product request: token missing')

    res.status(401).json({
      message: 'Authorization token is required',
    })
    return
  }

  const receivedToken = authorization.slice(bearerPrefix.length)

  if (!tokensMatch(receivedToken, expectedToken)) {
    console.warn('Rejected product request: token invalid')

    res.status(403).json({
      message: 'Invalid authorization token',
    })
    return
  }

  next()
}

app.get('/api/website/products', requireToken, async (_req, res) => {
  try {
    const response = await fetch(
      'https://omd.a2hosted.com/api/website/products',
      {
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10_000),
      }
    )

    if (!response.ok) {
      throw new Error(`Source API returned ${response.status}`)
    }

    const payload = await response.json()

    console.log('Authorized product request completed')

    res.set('Cache-Control', 'no-store')
    res.json(payload)
  } catch (error) {
    console.error('Unable to retrieve products:', error.message)

    res.status(502).json({
      message: 'Unable to load product data',
    })
  }
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Protected mock API running on http://127.0.0.1:${port}`)
})