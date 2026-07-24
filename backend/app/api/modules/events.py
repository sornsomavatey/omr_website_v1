from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import EventBooking
from ..dependencies.schemas import EventBookingCreate, EventBookingResponse
from ..utils.telegram import send_telegram_alert, send_reservation_telegram_alert
from ..utils.email import send_email_alert

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

    # Format and send Telegram Alert
    alert_message = (
        f"🎉 <b>Event Booking Request</b>\n\n"
        f"• Customer: {db_event.name}\n"
        f"• Phone: {db_event.phone}\n"
        f"• Email: {db_event.email}\n"
        f"• Event Type: {db_event.event_type}\n"
        f"• Guest Count: {db_event.guest_count}\n"
        f"• Date: {db_event.event_date}\n"
        f"• Details / Requirements:\n{db_event.package_details or 'None'}"
    )
    send_reservation_telegram_alert(alert_message)

    # Format and send Email Alert
    email_subject = "Booking events"
    email_text = alert_message
    email_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6b9158; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
            📋 Booking events
        </h2>
        <div style="background-color: #f9f9f9; border: 1px solid #e3e3e3; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Customer:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_event.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_event.phone}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_event.email}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Event Type:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_event.event_type}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Guest Count:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_event.guest_count}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Date:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_event.event_date}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Details / Requirements:</td>
                    <td style="padding: 8px 0; white-space: pre-wrap;">{db_event.package_details or 'None'}</td>
                </tr>
            </table>
        </div>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            This is an automated notification from the One More Restaurant booking system.
        </p>
    </body>
    </html>
    """
    send_email_alert(email_subject, email_html, email_text)

    return db_event

@router.get("/", response_model=List[EventBookingResponse])
def get_event_bookings(db: Session = Depends(get_db)):
    """Retrieve all event bookings (Admin/Coordinator view)."""
    bookings = db.query(EventBooking).order_by(EventBooking.created_at.desc()).all()
    return bookings
