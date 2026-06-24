from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import Reservation, Branch
from ..dependencies.schemas import ReservationCreate, ReservationResponse
from ..utils.telegram import send_telegram_alert
from ..utils.email import send_email_alert

router = APIRouter()

@router.post("/", response_model=ReservationResponse, status_code=201)
def create_reservation(res: ReservationCreate, db: Session = Depends(get_db)):
    """Create a new table reservation booking."""
    # Check if branch exists
    branch = db.query(Branch).filter(Branch.id == res.branch_id).first()
    if not branch:
        raise HTTPException(status_code=400, detail="Invalid branch_id selected")

    # Format reservation date to YYYY/month_name/DD (e.g. 2026/jun/12)
    formatted_date = res.reservation_date
    try:
        from datetime import datetime
        dt = datetime.strptime(res.reservation_date, "%Y-%m-%d")
        formatted_date = dt.strftime("%Y/%b/%d").lower()
    except Exception:
        pass

    db_res = Reservation(
        customer_name=res.customer_name,
        customer_email=res.customer_email,
        customer_phone=res.customer_phone,
        branch_id=res.branch_id,
        reservation_date=formatted_date,
        reservation_time=res.reservation_time,
        guest_count=res.guest_count,
        area=res.area,
        special_requests=res.special_requests
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)

    # Format and send Telegram Alert
    alert_message = (
        f"🚨 New Table Reservation Booking!\n"
        f"• Customer: {db_res.customer_name}\n"
        f"• Phone: {db_res.customer_phone}\n"
        f"• Date: {db_res.reservation_date}\n"
        f"• Time Slot: {db_res.reservation_time}\n"
        f"• Guest Count: {db_res.guest_count}\n"
        f"• Branch: {branch.name}\n"
        f"• Area: {db_res.area or 'Standard'}\n"
        f"• Special Requests: {db_res.special_requests or 'None'}"
    )
    send_telegram_alert(alert_message)

    # Format and send Email Alert
    email_subject = "OMR Reservation"
    email_text = alert_message
    email_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d9534f; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
            🚨 New Table Reservation Booking!
        </h2>
        <div style="background-color: #f9f9f9; border: 1px solid #e3e3e3; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Customer:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.customer_name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.customer_phone}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Date:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.reservation_date}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Time Slot:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.reservation_time}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Guest Count:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.guest_count}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Branch:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{branch.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Area:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.area or 'Standard'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Special Requests:</td>
                    <td style="padding: 8px 0;">{db_res.special_requests or 'None'}</td>
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

    return db_res

@router.get("/", response_model=List[ReservationResponse])
def get_reservations(db: Session = Depends(get_db)):
    """Retrieve all reservations (Admin/Staff view)."""
    reservations = db.query(Reservation).order_by(Reservation.created_at.desc()).all()
    return reservations
