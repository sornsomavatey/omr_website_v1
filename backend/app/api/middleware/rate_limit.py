import time
from collections import defaultdict
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        
        # Clean timestamps older than window
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] if now - t < self.window_seconds
        ]

        # Stricter rate limit for write/submit endpoints (reservations, contact, event-bookings)
        path = request.url.path
        is_write_submission = request.method in ["POST", "PUT", "DELETE"] and any(
            sub in path for sub in ["reservations", "contact", "event-bookings"]
        )
        allowed_limit = 10 if is_write_submission else self.max_requests

        if len(self.requests[client_ip]) >= allowed_limit:
            retry_after = int(self.window_seconds - (now - self.requests[client_ip][0]))
            headers = {"Retry-After": str(max(1, retry_after))}
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Please slow down and try again later.",
                    "retry_after_seconds": max(1, retry_after)
                },
                headers=headers
            )

        self.requests[client_ip].append(now)
        response = await call_next(request)
        return response

def setup_rate_limit(app: FastAPI) -> None:
    app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)
