import secrets

from fastapi import Header, HTTPException, status

from ..core.config import settings


def require_admin(x_admin_key: str | None = Header(default=None)) -> None:
    """Protect staff-only routes without exposing the key in URLs or logs."""
    if not settings.ADMIN_API_KEY:
        if settings.ENVIRONMENT.lower() == 'production':
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail='Admin access is not configured',
            )
        return

    if not x_admin_key or not secrets.compare_digest(
        x_admin_key,
        settings.ADMIN_API_KEY,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid admin credentials',
        )
