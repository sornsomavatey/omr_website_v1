from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from .db import Base

class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    map_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    opening_hours = Column(String(100), default="6:00 AM - 10:00 PM")

    reservations = relationship("Reservation", back_populates="branch")


class MenuCategory(Base):
    __tablename__ = "menu_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True)

    items = relationship("MenuItem", back_populates="category")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("menu_categories.id"), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    is_spicy = Column(Boolean, default=False)
    is_organic = Column(Boolean, default=False)
    allergens = Column(String(255), nullable=True)
    is_available = Column(Boolean, default=True)

    category = relationship("MenuCategory", back_populates="items")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(150), nullable=False)
    customer_email = Column(String(150), nullable=True)
    customer_phone = Column(String(100), nullable=False)
    customer_telegram = Column(String(100), nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    reservation_date = Column(String(50), nullable=False)  # ISO Date String
    reservation_time = Column(String(50), nullable=False)  # Time Slot
    guest_count = Column(Integer, nullable=False)
    adults = Column(Integer, nullable=True, default=1)
    kids = Column(Integer, nullable=True, default=0)
    area = Column(String(100), nullable=False)  # Hall, Garden, VIP, VVIP
    special_requests = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")  # Pending, Confirmed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    branch = relationship("Branch", back_populates="reservations")


class EventBooking(Base):
    __tablename__ = "event_bookings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(100), nullable=False)
    event_type = Column(String(100), nullable=False)  # Wedding, Corporate, Birthday
    guest_count = Column(Integer, nullable=False)
    event_date = Column(String(50), nullable=False)  # ISO Date String
    package_details = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")  # Pending, Confirmed, Closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ContactRequest(Base):
    __tablename__ = "contact_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=True, default="Anonymous")
    email = Column(String(150), nullable=True, default="N/A")
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=True, default="No written message provided.")
    status = Column(String(50), default="Unread")  # Unread, Read, Responded
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
