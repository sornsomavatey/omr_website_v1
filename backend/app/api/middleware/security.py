import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import FastAPI, Request
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import JSONResponse

from ..core.config import settings


_buckets: dict[str, deque[float]] = defaultdict(deque)
_bucket_lock = Lock()
def _client_ip(request: Request) -> str:
    if settings.TRUST_PROXY_HEADERS:
        forwarded = request.headers.get('x-forwarded-for')
        if forwarded:
            return forwarded.split(',', 1)[0].strip()
    return request.client.host if request.client else 'unknown'


def _rate_limit_identity(request: Request, scope: str) -> str:
    if scope == 'payment':
        user = getattr(request.state, 'user', None)
        user_id = getattr(user, 'id', None) or getattr(request.state, 'user_id', None)
        if user_id is not None:
            return f'user:{user_id}'
    return f'ip:{_client_ip(request)}'


def _rate_limit_for(request: Request) -> tuple[int, int, str]:
    normalized_path = request.url.path.rstrip('/') or '/'
    if request.method == 'POST':
        policies = {
            '/api/reservations': (
                settings.RESERVATION_RATE_LIMIT_REQUESTS,
                settings.RESERVATION_RATE_LIMIT_WINDOW_SECONDS,
                'reservation',
            ),
            '/api/contact': (
                settings.CONTACT_RATE_LIMIT_REQUESTS,
                settings.CONTACT_RATE_LIMIT_WINDOW_SECONDS,
                'contact',
            ),
            '/api/event-bookings': (
                settings.RESERVATION_RATE_LIMIT_REQUESTS,
                settings.RESERVATION_RATE_LIMIT_WINDOW_SECONDS,
                'event-booking',
            ),
            '/api/orders': (
                settings.ORDER_RATE_LIMIT_REQUESTS,
                settings.ORDER_RATE_LIMIT_WINDOW_SECONDS,
                'order',
            ),
            '/api/payments': (
                settings.PAYMENT_RATE_LIMIT_REQUESTS,
                settings.PAYMENT_RATE_LIMIT_WINDOW_SECONDS,
                'payment',
            ),
            '/api/users/login': (
                settings.LOGIN_RATE_LIMIT_REQUESTS,
                settings.LOGIN_RATE_LIMIT_WINDOW_SECONDS,
                'login',
            ),
            '/api/users/password-reset': (
                settings.PASSWORD_RESET_RATE_LIMIT_REQUESTS,
                settings.PASSWORD_RESET_RATE_LIMIT_WINDOW_SECONDS,
                'password-reset',
            ),
            '/api/newsletter': (
                settings.NEWSLETTER_RATE_LIMIT_REQUESTS,
                settings.NEWSLETTER_RATE_LIMIT_WINDOW_SECONDS,
                'newsletter',
            ),
        }
        policy = policies.get(normalized_path)
        if policy:
            return policy
    return (
        settings.RATE_LIMIT_REQUESTS,
        settings.RATE_LIMIT_WINDOW_SECONDS,
        'api',
    )


def setup_security(app: FastAPI) -> None:
    allowed_hosts = [
        host.strip()
        for host in settings.ALLOWED_HOSTS.split(',')
        if host.strip()
    ]
    if allowed_hosts:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=allowed_hosts,
            www_redirect=False,
        )
    if settings.FORCE_HTTPS:
        app.add_middleware(HTTPSRedirectMiddleware)

    @app.middleware('http')
    async def security_middleware(request: Request, call_next):
        content_length = request.headers.get('content-length')
        if content_length:
            try:
                if int(content_length) > settings.MAX_REQUEST_BODY_BYTES:
                    return JSONResponse(
                        status_code=413,
                        content={'detail': 'Request body too large'},
                    )
            except ValueError:
                return JSONResponse(
                    status_code=400,
                    content={'detail': 'Invalid Content-Length header'},
                )

        limit_headers: dict[str, str] = {}
        if settings.RATE_LIMIT_ENABLED and request.url.path.startswith('/api/'):
            limit, window, scope = _rate_limit_for(request)
            now = time.monotonic()
            key = f'{scope}:{_rate_limit_identity(request, scope)}'
            with _bucket_lock:
                bucket = _buckets[key]
                cutoff = now - window
                while bucket and bucket[0] <= cutoff:
                    bucket.popleft()
                if len(bucket) >= limit:
                    retry_after = max(1, int(window - (now - bucket[0])) + 1)
                    return JSONResponse(
                        status_code=429,
                        content={'detail': 'Too many requests. Please try again later.'},
                        headers={
                            'Retry-After': str(retry_after),
                            'RateLimit-Limit': str(limit),
                            'RateLimit-Remaining': '0',
                        },
                    )
                bucket.append(now)
                remaining = max(0, limit - len(bucket))
            limit_headers = {
                'RateLimit-Limit': str(limit),
                'RateLimit-Remaining': str(remaining),
            }

        response = await call_next(request)
        response.headers.update(limit_headers)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Permissions-Policy'] = (
            'camera=(), microphone=(), geolocation=(), payment=()'
        )
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        if settings.FORCE_HTTPS:
            response.headers['Strict-Transport-Security'] = (
                'max-age=31536000; includeSubDomains'
            )
        return response
