# Website security

This project protects both public request paths:

- `Frontend/server.js`: Helmet browser headers, production Content Security
  Policy, HSTS, hidden framework signature, safe error responses, and
  per-client request limiting.
- `backend/app`: restricted CORS, trusted-host validation, optional HTTPS
  enforcement, request-size limits, a general API limit, and separate limits
  for sensitive actions.

Default API limits:

| Action | Limit |
| --- | --- |
| Table reservation | 3 per 10 minutes per IP |
| Contact form | 5 per 10 minutes per IP |
| Online order creation | 10 per 10 minutes per IP |
| Payment attempt | 5 per 15 minutes per user/IP key |
| Login | 5 attempts per 10 minutes |
| Password reset | 3 per hour |
| Menu and other API reads | 120 per minute per IP |
| Newsletter signup | 3 per hour |

Payment limits use the authenticated user ID when authentication middleware
provides one, with IP as a safe fallback. The current project does not yet
contain order, payment, login, password-reset, or newsletter routes; their
policies are preconfigured for those conventional API paths. When those
features are implemented, login limiting should be connected to the
authentication result so only failed attempts remain counted.

## Production configuration

Copy the values from `Frontend/.env.example` and `backend/.env.example` into
the deployment secret manager. At minimum:

```dotenv
# Frontend
TRUST_PROXY=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_REQUESTS=120

# Backend
ENVIRONMENT=production
CORS_ORIGINS=https://onemorerestaurant.com,https://www.onemorerestaurant.com
ALLOWED_HOSTS=onemorerestaurant.com,www.onemorerestaurant.com
FORCE_HTTPS=true
TRUST_PROXY_HEADERS=true
ADMIN_API_KEY=replace-with-at-least-32-random-bytes
```

Only enable proxy trust when the application cannot be reached except through
your trusted reverse proxy/load balancer. Otherwise clients can forge their IP
address and bypass IP-based rate limits.

Staff clients must send the admin secret in the `X-Admin-Key` header when
listing customer submissions, sending customer emails, or changing menu and
branch data. Production fails closed when `ADMIN_API_KEY` is missing. This key
is an initial server-to-server/admin control; use individual staff accounts
with MFA and roles if a browser-based admin portal is added.

The included limiters store counters in application memory. This is suitable
for one running instance. For multiple instances, enforce the same limits at
the CDN/WAF or load balancer (for example Cloudflare, AWS WAF, or nginx backed
by a shared store), so every instance sees one counter.

## Automated checks

`.github/workflows/security.yml` runs weekly and on pushes/pull requests:

- npm and Python dependency audits
- Trivy dependency, secret, and misconfiguration scanning
- CodeQL analysis for JavaScript/TypeScript and Python

Treat scan exclusions as reviewed exceptions: document an owner, reason, and
expiry date rather than suppressing findings without context.

## Operational checklist

- Terminate TLS at the reverse proxy and keep certificates renewed.
- Keep production `.env` files out of Git and rotate any exposed secret.
- Restrict database access to the backend service account and back it up.
- Log 401, 403, 413, and 429 responses; alert on sustained spikes.
- Add CAPTCHA or another challenge if form spam continues after rate limiting.
- Patch dependencies regularly and review GitHub Security alerts.
