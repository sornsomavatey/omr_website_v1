from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..dependencies.db import get_db
from ..dependencies.models import Branch
from ..dependencies.schemas import BranchCreate, BranchResponse

router = APIRouter()

@router.get("/", response_model=List[BranchResponse])
def get_branches(db: Session = Depends(get_db)):
    """Retrieve all restaurant branches."""
    branches = db.query(Branch).all()
    return branches

@router.post("/", response_model=BranchResponse, status_code=201)
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    """Create a new restaurant branch (Admin)."""
    db_branch = Branch(
        name=branch.name,
        address=branch.address,
        phone=branch.phone,
        map_url=branch.map_url,
        image_url=branch.image_url,
        opening_hours=branch.opening_hours
    )
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch
