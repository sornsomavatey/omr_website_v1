from fastapi import FastAPI


def setup_logging(app: FastAPI) -> None:
    @app.middleware('http')
    async def log_requests(request, call_next):
        response = await call_next(request)
        print(f"[FastAPI] {request.method} {request.url} -> {response.status_code}")
        return response
