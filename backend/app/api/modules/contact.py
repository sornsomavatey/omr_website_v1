from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import ContactRequest
from ..dependencies.schemas import ContactRequestCreate, ContactRequestResponse

router = APIRouter()

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
    return db_req

@router.get("/", response_model=List[ContactRequestResponse])
def get_contact_requests(db: Session = Depends(get_db)):
    """Retrieve all contact requests (Admin view)."""
    requests = db.query(ContactRequest).order_by(ContactRequest.created_at.desc()).all()
    return requests
