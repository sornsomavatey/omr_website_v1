from fastapi import FastAPI
import logging

from .api.core.config import settings
from .api.middleware.cors import setup_cors
from .api.middleware.logging import setup_logging

# Routers
from .api.modules.users import router as users_router
from .api.modules.items import router as items_router
from .api.modules.branches import router as branches_router
from .api.modules.menu import router as menu_router
from .api.modules.reservations import router as reservations_router
from .api.modules.events import router as events_router
from .api.modules.contact import router as contact_router

# DB creation helpers
from .api.dependencies.db import engine, Base

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

setup_logging(app)
setup_cors(app)

# Register routers
app.include_router(users_router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(items_router, prefix=f"{settings.API_PREFIX}/items", tags=["items"])
app.include_router(branches_router, prefix=f"{settings.API_PREFIX}/branches", tags=["branches"])
app.include_router(menu_router, prefix=f"{settings.API_PREFIX}/menu", tags=["menu"])
app.include_router(reservations_router, prefix=f"{settings.API_PREFIX}/reservations", tags=["reservations"])
app.include_router(events_router, prefix=f"{settings.API_PREFIX}/event-bookings", tags=["event-bookings"])
app.include_router(contact_router, prefix=f"{settings.API_PREFIX}/contact", tags=["contact"])

@app.on_event("startup")
def on_startup():
    logging.info("Initializing Database and Tables...")
    Base.metadata.create_all(bind=engine)
