from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import ContactRequest
from ..dependencies.schemas import ContactRequestCreate, ContactRequestResponse

from ..utils.telegram import send_feedback_telegram_alert

import re

router = APIRouter()

def format_telegram_feedback_alert(req: ContactRequest) -> str:
    """Format a clean, beautifully structured Telegram message for feedback and contact inquiries."""
    name_display = req.name.strip() if req.name and req.name.strip() and req.name.strip() != 'Anonymous' else 'Anonymous Guest'
    email_text = f"• <b>Email:</b> {req.email.strip()}\n" if req.email and req.email.strip() not in ('N/A', '') else ""

    # Check for rating in subject or message (e.g. 4/5)
    rating_num = None
    rating_match = re.search(r'(\d)/5', f"{req.subject} {req.message}")
    if rating_match:
        try:
            rating_num = int(rating_match.group(1))
        except ValueError:
            pass

    stars = (" " + "⭐" * rating_num + "☆" * (5 - rating_num)) if rating_num else ""

    # Check for branch name
    branch_name = None
    for b in ['Toul Kork', 'Boeung Kak']:
        if b.lower() in req.subject.lower() or b.lower() in req.message.lower():
            branch_name = b
            break

    # Extract user message body cleanly
    raw_lines = req.message.split('\n')
    user_msg_lines = [
        line for line in raw_lines
        if not line.strip().startswith('Branch:') and not line.strip().startswith('Rating:')
    ]
    user_text = "\n".join(user_msg_lines).strip()
    msg_display = f'"{user_text}"' if user_text else '<i>(No written message provided)</i>'

    if branch_name or rating_num:
        branch_str = f"• <b>Branch:</b> {branch_name}\n" if branch_name else ""
        rating_str = f"• <b>Rating:</b> {rating_num} / 5 Stars{stars}\n" if rating_num else ""
        return (
            f"💡 <b>New Customer Feedback</b>{stars}\n\n"
            f"{branch_str}"
            f"• <b>Customer:</b> {name_display}\n"
            f"{email_text}"
            f"{rating_str}\n"
            f"💬 <b>Feedback Message:</b>\n{msg_display}"
        )
    else:
        return (
            f"📩 <b>New Customer Inquiry</b>\n\n"
            f"• <b>Customer:</b> {name_display}\n"
            f"{email_text}"
            f"• <b>Subject:</b> {req.subject or 'General Inquiry'}\n\n"
            f"💬 <b>Message:</b>\n{msg_display}"
        )


@router.post("/", response_model=ContactRequestResponse, status_code=201)
def create_contact_request(req: ContactRequestCreate, db: Session = Depends(get_db)):
    """Submit a general contact or feedback request."""
    db_req = ContactRequest(
        name=req.name,
        email=req.email,
        subject=req.subject,
        message=req.message
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)

    # Send alert to Telegram Feedback topic
    feedback_alert = format_telegram_feedback_alert(db_req)
    send_feedback_telegram_alert(feedback_alert)

    return db_req

@router.get("/", response_model=List[ContactRequestResponse])
def get_contact_requests(db: Session = Depends(get_db)):
    """Retrieve all contact requests (Admin view)."""
    requests = db.query(ContactRequest).order_by(ContactRequest.created_at.desc()).all()
    return requests
