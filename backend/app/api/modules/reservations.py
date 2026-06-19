from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import Reservation, Branch
from ..dependencies.schemas import ReservationCreate, ReservationResponse

router = APIRouter()

@router.post("/", response_model=ReservationResponse, status_code=201)
def create_reservation(res: ReservationCreate, db: Session = Depends(get_db)):
    """Create a new table reservation booking."""
    # Check if branch exists
    branch = db.query(Branch).filter(Branch.id == res.branch_id).first()
    if not branch:
        raise HTTPException(status_code=400, detail="Invalid branch_id selected")

    db_res = Reservation(
        customer_name=res.customer_name,
        customer_email=res.customer_email,
        customer_phone=res.customer_phone,
        branch_id=res.branch_id,
        reservation_date=res.reservation_date,
        reservation_time=res.reservation_time,
        guest_count=res.guest_count,
        area=res.area,
        special_requests=res.special_requests
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res

@router.get("/", response_model=List[ReservationResponse])
def get_reservations(db: Session = Depends(get_db)):
    """Retrieve all reservations (Admin/Staff view)."""
    reservations = db.query(Reservation).order_by(Reservation.created_at.desc()).all()
    return reservations
