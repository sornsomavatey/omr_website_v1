from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ..core.config import settings


def setup_cors(app: FastAPI) -> None:
    allowed_origins = [
        origin.strip()
        for origin in settings.CORS_ORIGINS.split(',')
        if origin.strip()
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=False,
        allow_methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allow_headers=['Accept', 'Authorization', 'Content-Type'],
        max_age=600,
    )
