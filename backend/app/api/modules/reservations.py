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
        adults=res.adults,
        kids=res.kids,
        area=res.area,
        special_requests=res.special_requests
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)

    # preordered items 
    preorder_telegram = ""
    email_preorder_html = ""
    
    if res.preordered_items:
        items_list = [f"  - {item.name} x{item.qty} (${item.price * item.qty:.2f})" for item in res.preordered_items]
        preorder_telegram = "\n• <b>Pre-ordered Items:</b>\n" + "\n".join(items_list)

        items_rows = "".join([
            f"<tr>"
            f"<td style='padding: 8px; border-bottom: 1px dashed #eee;'>{item.name}</td>"
            f"<td style='padding: 8px; text-align: center; border-bottom: 1px dashed #eee;'>{item.qty}</td>"
            f"<td style='padding: 8px; text-align: right; border-bottom: 1px dashed #eee;'>${item.price * item.qty:.2f}</td>"
            f"</tr>"
            for item in res.preordered_items
        ])
        total_price = sum(item.price * item.qty for item in res.preordered_items)
        email_preorder_html = f"""
        <h3 style="color: #6b9158; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 8px; font-family: Arial, sans-serif;">
            🍽️ Pre-ordered Items
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 14px;">
            <thead>
                <tr style="background-color: #f2f5f1; color: #212d1b;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: center; width: 60px;">Qty</th>
                    <th style="padding: 8px; text-align: right; width: 90px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {items_rows}
                <tr>
                    <td colspan="2" style="padding: 10px 8px; font-weight: bold; text-align: right; border-top: 1px solid #ddd;">Total:</td>
                    <td style="padding: 10px 8px; font-weight: bold; text-align: right; color: #6b9158; border-top: 1px solid #ddd;">${total_price:.2f}</td>
                </tr>
            </tbody>
        </table>
        """

    # Format and send Telegram Alert
    alert_message = (
        f"📋 <b>Booking table</b>\n\n"
        f"• Customer: {db_res.customer_name}\n"
        f"• Phone: {db_res.customer_phone}\n"
        f"• Date: {db_res.reservation_date}\n"
        f"• Time Slot: {db_res.reservation_time}\n"
        f"• Guest Count: {db_res.guest_count} ({db_res.adults or 1} Adults, {db_res.kids or 0} Kids)\n"
        f"• Branch: {branch.name}\n"
        f"• Area: {db_res.area or 'Standard'}\n"
        f"• Special Requests: {db_res.special_requests or 'None'}"
        f"{preorder_telegram}"
    )
    send_telegram_alert(alert_message)

    # Format and send Email Alert
    email_subject = "Booking table"
    email_text = alert_message
    email_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6b9158; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
            📋 Booking table
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
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{db_res.guest_count} ({db_res.adults or 1} Adults, {db_res.kids or 0} Kids)</td>
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
        {email_preorder_html}
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            This is an automated notification from the One More Restaurant booking system.
        </p>
    </body>
    </html>
    """
    send_email_alert(email_subject, email_html, email_text)

    # Set transient preordered_items property to response
    db_res.preordered_items = res.preordered_items
    return db_res

@router.get("/", response_model=List[ReservationResponse])
def get_reservations(db: Session = Depends(get_db)):
    """Retrieve all reservations (Admin/Staff view)."""
    reservations = db.query(Reservation).order_by(Reservation.created_at.desc()).all()
    return reservations
