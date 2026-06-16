from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import EventBooking
from ..dependencies.schemas import EventBookingCreate, EventBookingResponse

router = APIRouter()

@router.post("/", response_model=EventBookingResponse, status_code=201)
def create_event_booking(event: EventBookingCreate, db: Session = Depends(get_db)):
    """Create an event booking or quotation proposal request."""
    db_event = EventBooking(
        name=event.name,
        email=event.email,
        phone=event.phone,
        event_type=event.event_type,
        guest_count=event.guest_count,
        event_date=event.event_date,
        package_details=event.package_details
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[EventBookingResponse])
def get_event_bookings(db: Session = Depends(get_db)):
    """Retrieve all event bookings (Admin/Coordinator view)."""
    bookings = db.query(EventBooking).order_by(EventBooking.created_at.desc()).all()
    return bookings
