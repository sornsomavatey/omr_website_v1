from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import datetime

# ----------------- BRANCH SCHEMAS -----------------
class BranchBase(BaseModel):
    name: str
    address: str
    phone: str
    map_url: Optional[str] = None
    image_url: Optional[str] = None
    opening_hours: Optional[str] = "6:00 AM - 10:00 PM"

class BranchCreate(BranchBase):
    pass

class BranchResponse(BranchBase):
    id: int

    model_config = {
        "from_attributes": True
    }


# ----------------- MENU SCHEMAS -----------------
class MenuCategoryBase(BaseModel):
    name: str
    slug: str

class MenuCategoryCreate(MenuCategoryBase):
    pass

class MenuCategoryResponse(MenuCategoryBase):
    id: int

    model_config = {
        "from_attributes": True
    }


class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_featured: Optional[bool] = False
    is_spicy: Optional[bool] = False
    is_organic: Optional[bool] = False
    allergens: Optional[str] = None
    is_available: Optional[bool] = True

class MenuItemCreate(MenuItemBase):
    category_id: int

class MenuItemResponse(MenuItemBase):
    id: int
    category_id: int
    category_name: Optional[str] = None

    model_config = {
        "from_attributes": True
    }


# ----------------- RESERVATION SCHEMAS -----------------
class ReservationCreate(BaseModel):
    customer_name: str = Field(..., min_length=2)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=8)
    branch_id: int
    reservation_date: str
    reservation_time: str
    guest_count: int = Field(..., gt=0)
    area: str
    special_requests: Optional[str] = None

class ReservationResponse(ReservationCreate):
    id: int
    status: str
    created_at: datetime.datetime

    model_config = {
        "from_attributes": True
    }


# ----------------- EVENT BOOKING SCHEMAS -----------------
class EventBookingCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    phone: str = Field(..., min_length=8)
    event_type: str
    guest_count: int = Field(..., gt=0)
    event_date: str
    package_details: Optional[str] = None

class EventBookingResponse(EventBookingCreate):
    id: int
    status: str
    created_at: datetime.datetime

    model_config = {
        "from_attributes": True
    }


# ----------------- CONTACT SCHEMAS -----------------
class ContactRequestCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    subject: str = Field(..., min_length=3)
    message: str = Field(..., min_length=5)

class ContactRequestResponse(ContactRequestCreate):
    id: int
    status: str
    created_at: datetime.datetime

    model_config = {
        "from_attributes": True
    }
