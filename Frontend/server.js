import fs from 'node:fs/promises'
import nodeFs from 'node:fs'
import zlib from 'node:zlib'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import nodemailer from 'nodemailer'

// Load .env variables into process.env automatically for server environment
try {
  if (nodeFs.existsSync('./.env')) {
    const envContent = nodeFs.readFileSync('./.env', 'utf-8')
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valParts] = trimmed.split('=')
        const keyName = key.trim()
        let val = valParts.join('=').trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (!process.env[keyName]) {
          process.env[keyName] = val
        }
      }
    }
  }
} catch {
  // Ignore env parse errors
}


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
app.use(express.json())

// Anti-spam & duplicate submission detection (60-second sliding window)
const recentSubmissionsCache = new Map()
const DUPLICATE_COOLDOWN_MS = 60_000

const isDuplicateSubmission = (key) => {
  const now = Date.now()
  for (const [k, timestamp] of recentSubmissionsCache.entries()) {
    if (now - timestamp > DUPLICATE_COOLDOWN_MS) {
      recentSubmissionsCache.delete(k)
    }
  }

  if (recentSubmissionsCache.has(key)) {
    const prevTime = recentSubmissionsCache.get(key)
    if (now - prevTime < DUPLICATE_COOLDOWN_MS) {
      return true
    }
  }

  recentSubmissionsCache.set(key, now)
  return false
}

// Secure Server-side Telegram Proxy (Keeps Telegram Token 100% hidden from client DevTools)
app.post('/api/telegram-reservation', async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || '8889927818:AAETEXfIph1TZxJgK5BaLtawKYhYRXIIn1M'
  const chatId = process.env.TELEGRAM_CHAT_ID || '-1003911645931'
  const threadId = process.env.TELEGRAM_RESERVATION_THREAD_ID || '2'

  const data = req.body || {}
  if (!data.customer_name || !data.customer_phone) {
    return res.status(400).json({ ok: false, message: 'Missing required reservation fields' })
  }

  const dupKey = `res_${data.customer_phone || ''}_${data.branch_id || ''}_${data.reservation_date || ''}_${data.reservation_time || ''}`
  if (isDuplicateSubmission(dupKey)) {
    return res.status(429).json({ ok: false, message: 'Duplicate reservation detected. Please wait before trying again.' })
  }


  const escapeHtml = (text) =>
    String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const normalizeToEnglishTime = (timeStr) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
    let res = String(timeStr || '')
    khmerDigits.forEach((kh, i) => {
      res = res.replaceAll(kh, String(i))
    })
    return res.replace(/\s*ព្រឹក/gi, ' AM').replace(/\s*(ល្ងាច|ថ្ងៃ|យប់)/gi, ' PM').trim()
  }

  const safeCustomerName = escapeHtml(data.customer_name)
  const safePhone = escapeHtml(data.customer_phone)
  const safeEmail = data.customer_email ? escapeHtml(data.customer_email) : ''
  const branchMap = { 1: 'Toul Kork', 2: 'Boeung Kak', '1': 'Toul Kork', '2': 'Boeung Kak' }
  const rawBranch = data.branch_name || data.branch || (data.branch_id ? branchMap[data.branch_id] : '') || 'Boeung Kak'
  const safeBranch = escapeHtml(rawBranch)
  const safeDate = normalizeToEnglishTime(escapeHtml(data.reservation_date))
  const safeTime = normalizeToEnglishTime(escapeHtml(data.reservation_time))
  const safeArea = escapeHtml(data.area || 'Standard')
  const safeNotes = data.special_requests ? escapeHtml(data.special_requests) : ''

  const adults = Number(data.adults) || 1
  const kids = Number(data.kids) || 0
  const totalGuests = Number(data.guest_count) || (adults + kids)
  const guestUnit = totalGuests === 1 ? 'person' : 'people'
  const adultsStr = `${adults} Adult${adults === 1 ? '' : 's'}`
  const kidsStr = kids > 0 ? `, ${kids} Kid${kids === 1 ? '' : 's'}` : ''
  const guestsFormatted = `${totalGuests} ${guestUnit} (${adultsStr}${kidsStr})`

  const lines = [
    '📅 <b>NEW TABLE RESERVATION</b>',
    '',
    `• <b>Branch:</b> ${safeBranch}`,
    `• <b>Customer:</b> ${safeCustomerName}`,
    `• <b>Phone:</b> ${safePhone}`,
  ]

  if (safeEmail) {
    lines.push(`• <b>Email:</b> ${safeEmail}`)
  }

  lines.push(`• <b>Guests:</b> ${guestsFormatted}`)
  lines.push(`• <b>Seating Area:</b> ${safeArea}`)
  lines.push(`• <b>Date:</b> ${safeDate}`)
  lines.push(`• <b>Time:</b> ${safeTime}`)

  if (safeNotes) {
    lines.push(`• <b>Special Requests:</b> ${safeNotes}`)
  }

  let preorderHtml = ''
  if (Array.isArray(data.preordered_items) && data.preordered_items.length > 0) {
    lines.push('')
    lines.push('🛒 <b>PRE-ORDERED DISHES:</b>')
    let total = 0
    let hasPrice = false
    let preorderItemsListHtml = ''

    data.preordered_items.forEach((item) => {
      const qty = Number(item.qty) || 1
      const name = escapeHtml(item.name || '')
      const rawPriceStr = item.price ? String(item.price).replace(/[^0-9.]/g, '') : ''
      const unitPrice = parseFloat(rawPriceStr)

      let priceStr = ''
      if (!isNaN(unitPrice) && unitPrice > 0) {
        hasPrice = true
        total += unitPrice * qty
        const cleanVal = unitPrice % 1 === 0 ? String(unitPrice) : unitPrice.toFixed(2)
        priceStr = ` (${cleanVal})`
      } else if (item.price) {
        priceStr = ` (${escapeHtml(String(item.price))})`
      }

      lines.push(`  └ ${qty}x ${name}${priceStr}`)
      preorderItemsListHtml += `<li style="margin: 4px 0;">${qty}x ${name}${priceStr}</li>`
    })

    if (hasPrice && total > 0) {
      lines.push(`<b>Total:</b> $${total.toFixed(2)}`)
    }

    preorderHtml = `
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #ddd;">
        <h4 style="margin: 0 0 8px 0; color: #5b8045;">🛒 Pre-ordered Dishes:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #333;">${preorderItemsListHtml}</ul>
        ${hasPrice && total > 0 ? `<p style="margin-top: 8px;"><b>Total:</b> $${total.toFixed(2)}</p>` : ''}
      </div>
    `
  }

  const message = lines.join('\n')

  try {
    const telegramPayload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }

    if (threadId) {
      telegramPayload.message_thread_id = Number(threadId)
    }

    // 1. Send Telegram Alert
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    })
    const result = await response.json()

    // 2. Send Team Email Alert via SMTP (Nodemailer) - Non-blocking async
    const teamEmail = process.env.TEAM_ALERT_EMAIL || process.env.MAIL_FROM_ADDRESS || 'darichhy61@gmail.com'
    const mailUser = process.env.MAIL_USERNAME || 'darichhy61@gmail.com'
    const mailPass = process.env.MAIL_PASSWORD || ''

    if (teamEmail && mailUser && mailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.MAIL_PORT || 587),
          secure: false,
          auth: { user: mailUser, pass: mailPass },
        })

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #5b8045; color: #fff; padding: 16px; text-align: center;">
              <h2 style="margin: 0;">📋 NEW TABLE RESERVATION</h2>
            </div>
            <div style="padding: 20px;">
              <p><b>Branch:</b> ${safeBranch}</p>
              <p><b>Customer Name:</b> ${safeCustomerName}</p>
              <p><b>Phone:</b> ${safePhone}</p>
              ${safeEmail ? `<p><b>Email:</b> ${safeEmail}</p>` : ''}
              <p><b>Guests:</b> ${guestsFormatted}</p>
              <p><b>Seating Area:</b> ${safeArea}</p>
              <p><b>Date:</b> ${safeDate}</p>
              <p><b>Time:</b> ${safeTime}</p>
              ${safeNotes ? `<p><b>Special Requests:</b> ${safeNotes}</p>` : ''}
              ${preorderHtml}
            </div>
          </div>
        `

        transporter.sendMail({
          from: `"One More Restaurant" <${mailUser}>`,
          to: teamEmail,
          subject: `📋 New Table Reservation - ${safeCustomerName}`,
          html: htmlContent,
        }).catch((mailErr) => {
          console.error('Server team email alert error:', mailErr)
        })
      } catch (mailErr) {
        console.error('Server team email alert error:', mailErr)
      }
    }

    return res.status(response.ok ? 200 : 400).json(result)
  } catch (err) {
    console.error('Server notification error:', err)
    return res.status(500).json({ ok: false, message: 'Server notification error' })
  }
})

app.post('/api/telegram-event', async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || '8889927818:AAETEXfIph1TZxJgK5BaLtawKYhYRXIIn1M'
  const chatId = process.env.TELEGRAM_CHAT_ID || '-1003911645931'
  const threadId = process.env.TELEGRAM_EVENT_THREAD_ID || process.env.TELEGRAM_RESERVATION_THREAD_ID || '2'

  const data = req.body || {}
  const dupKey = `evt_${data.customer_phone || data.phone || ''}_${data.event_type || ''}_${data.event_date || data.date || ''}`
  if (isDuplicateSubmission(dupKey)) {
    return res.status(429).json({ ok: false, message: 'Duplicate event inquiry detected. Please wait before trying again.' })
  }
  const escapeHtml = (text) =>
    String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const safeCustomerName = escapeHtml(data.customer_name || data.name)
  const safePhone = escapeHtml(data.customer_phone || data.phone)
  const safeEmail = data.customer_email || data.email ? escapeHtml(data.customer_email || data.email) : ''
  const safeBranch = escapeHtml(data.branch_name || data.branch || 'One More Restaurant')
  const safeCompany = data.company ? escapeHtml(data.company) : ''
  const safeEventType = escapeHtml(data.event_type || 'Event Inquiry')
  const guestCount = Number(data.guest_count) || 1
  const safeDate = escapeHtml(data.event_date || data.date || new Date().toISOString().split('T')[0])
  const safeNotes = data.special_requirements ? escapeHtml(data.special_requirements) : ''
  const safeRef = data.booking_ref ? escapeHtml(data.booking_ref) : ''

  const lines = [
    '🎉 <b>NEW EVENT INQUIRY</b>',
    '',
  ]

  if (safeRef) {
    lines.push(`• <b>Ref Code:</b> #${safeRef}`)
  }
  lines.push(`• <b>Branch:</b> ${safeBranch}`)
  lines.push(`• <b>Customer:</b> ${safeCustomerName}`)
  lines.push(`• <b>Phone:</b> ${safePhone}`)

  if (safeEmail && safeEmail !== 'noemail@onemore.com') {
    lines.push(`• <b>Email:</b> ${safeEmail}`)
  }
  if (safeCompany) {
    lines.push(`• <b>Company:</b> ${safeCompany}`)
  }
  lines.push(`• <b>Event Type:</b> ${safeEventType}`)
  lines.push(`• <b>Expected Guests:</b> ${guestCount} ${guestCount === 1 ? 'person' : 'people'}`)
  lines.push(`• <b>Date:</b> ${safeDate}`)

  if (safeNotes) {
    lines.push(`• <b>Special Requirements:</b> ${safeNotes}`)
  }

  const message = lines.join('\n')

  try {
    const telegramPayload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }
    if (threadId) {
      telegramPayload.message_thread_id = Number(threadId)
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    })
    const result = await response.json()

    // 2. Non-blocking Team Email Alert
    const teamEmail = process.env.TEAM_ALERT_EMAIL || process.env.MAIL_FROM_ADDRESS || 'darichhy61@gmail.com'
    const mailUser = process.env.MAIL_USERNAME || 'darichhy61@gmail.com'
    const mailPass = process.env.MAIL_PASSWORD || ''

    if (teamEmail && mailUser && mailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.MAIL_PORT || 587),
          secure: false,
          auth: { user: mailUser, pass: mailPass },
        })

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #5b8045; color: #fff; padding: 16px; text-align: center;">
              <h2 style="margin: 0;">🎉 NEW EVENT INQUIRY</h2>
            </div>
            <div style="padding: 20px;">
              ${safeRef ? `<p style="margin: 8px 0;"><b>Ref Code:</b> #${safeRef}</p>` : ''}
              <p style="margin: 8px 0;"><b>Branch:</b> ${safeBranch}</p>
              <p style="margin: 8px 0;"><b>Customer Name:</b> ${safeCustomerName}</p>
              <p style="margin: 8px 0;"><b>Phone:</b> ${safePhone}</p>
              ${safeEmail && safeEmail !== 'noemail@onemore.com' ? `<p style="margin: 8px 0;"><b>Email:</b> ${safeEmail}</p>` : ''}
              ${safeCompany ? `<p style="margin: 8px 0;"><b>Company:</b> ${safeCompany}</p>` : ''}
              <p style="margin: 8px 0;"><b>Event Type:</b> ${safeEventType}</p>
              <p style="margin: 8px 0;"><b>Expected Guests:</b> ${guestCount} ${guestCount === 1 ? 'person' : 'people'}</p>
              <p style="margin: 8px 0;"><b>Date:</b> ${safeDate}</p>
              ${safeNotes ? `<p style="margin: 8px 0;"><b>Special Requirements:</b> ${safeNotes}</p>` : ''}
            </div>
          </div>
        `

        transporter.sendMail({
          from: `"One More Restaurant" <${mailUser}>`,
          to: teamEmail,
          subject: `🎉 New Event Inquiry - ${safeCustomerName}${safeRef ? ` (#${safeRef})` : ''}`,
          html: htmlContent,
        }).catch((mailErr) => console.error('Server team email error:', mailErr))
      } catch (mailErr) {
        console.error('Server team email error:', mailErr)
      }
    }

    return res.status(response.ok ? 200 : 400).json(result)
  } catch (err) {
    console.error('Server notification error:', err)
    return res.status(500).json({ ok: false, message: 'Server notification error' })
  }
})

app.post('/api/telegram-feedback', async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || '8889927818:AAETEXfIph1TZxJgK5BaLtawKYhYRXIIn1M'
  const chatId = process.env.TELEGRAM_CHAT_ID || '-1003911645931'
  const threadId = process.env.TELEGRAM_FEEDBACK_THREAD_ID || '4'

  const data = req.body || {}
  const dupKey = `fb_${data.customer_name || data.name || ''}_${data.branch_name || data.branch || ''}_${data.rating || ''}`
  if (isDuplicateSubmission(dupKey)) {
    return res.status(429).json({ ok: false, message: 'Duplicate feedback detected. Please wait before trying again.' })
  }
  const escapeHtml = (text) =>
    String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const safeCustomerName = escapeHtml(data.customer_name || data.name || 'Anonymous')
  const safeEmail = data.customer_email || data.email
  const cleanEmail = safeEmail && safeEmail !== 'N/A' ? escapeHtml(safeEmail) : ''
  const safeBranch = escapeHtml(data.branch_name || data.branch || 'General')
  const rating = Math.min(5, Math.max(1, Number(data.rating) || 5))
  const stars = '⭐'.repeat(rating)
  const safeSubject = escapeHtml(data.subject || `Guest feedback - ${safeBranch} - ${rating}/5`)
  const safeMessage = escapeHtml(data.message || '(No details provided)')

  const lines = [
    '💬 <b>NEW GUEST FEEDBACK</b>',
    '',
    `• <b>Branch:</b> ${safeBranch}`,
    `• <b>Customer:</b> ${safeCustomerName}`,
  ]

  if (cleanEmail) {
    lines.push(`• <b>Email:</b> ${cleanEmail}`)
  }

  lines.push(`• <b>Rating:</b> ${stars} (${rating}/5)`)
  lines.push(`• <b>Subject:</b> ${safeSubject}`)
  lines.push(`• <b>Message:</b> ${safeMessage}`)

  const message = lines.join('\n')

  try {
    const telegramPayload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }
    if (threadId) {
      telegramPayload.message_thread_id = Number(threadId)
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    })
    const result = await response.json()

    // 2. Non-blocking Team Email Alert
    const teamEmail = process.env.TEAM_ALERT_EMAIL || process.env.MAIL_FROM_ADDRESS || 'darichhy61@gmail.com'
    const mailUser = process.env.MAIL_USERNAME || 'darichhy61@gmail.com'
    const mailPass = process.env.MAIL_PASSWORD || ''

    if (teamEmail && mailUser && mailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.MAIL_PORT || 587),
          secure: false,
          auth: { user: mailUser, pass: mailPass },
        })

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #5b8045; color: #fff; padding: 16px; text-align: center;">
              <h2 style="margin: 0;">💬 NEW GUEST FEEDBACK</h2>
            </div>
            <div style="padding: 20px;">
              <p style="margin: 8px 0;"><b>Branch:</b> ${safeBranch}</p>
              <p style="margin: 8px 0;"><b>Customer Name:</b> ${safeCustomerName}</p>
              ${cleanEmail ? `<p style="margin: 8px 0;"><b>Email:</b> ${cleanEmail}</p>` : ''}
              <p style="margin: 8px 0;"><b>Rating:</b> ${stars} (${rating}/5)</p>
              <p style="margin: 8px 0;"><b>Subject:</b> ${safeSubject}</p>
              <p style="margin: 8px 0;"><b>Message:</b> ${safeMessage.replace(/\n/g, '<br/>')}</p>
            </div>
          </div>
        `

        transporter.sendMail({
          from: `"One More Restaurant" <${mailUser}>`,
          to: teamEmail,
          subject: `💬 New Guest Feedback - ${safeBranch} (${rating}/5)`,
          html: htmlContent,
        }).catch((mailErr) => console.error('Server team email error:', mailErr))
      } catch (mailErr) {
        console.error('Server team email error:', mailErr)
      }
    }

    return res.status(response.ok ? 200 : 400).json(result)
  } catch (err) {
    console.error('Server notification error:', err)
    return res.status(500).json({ ok: false, message: 'Server notification error' })
  }
})

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
