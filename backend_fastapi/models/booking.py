from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class BookingBase(SQLModel):
    userId: int = Field(foreign_key="user.id")
    serviceId: int = Field(foreign_key="service.id")
    providerId: Optional[int] = Field(default=None, foreign_key="user.id")
    bookingDate: datetime
    bookingTime: str
    address: str
    totalAmount: float
    status: BookingStatus = Field(default=BookingStatus.PENDING)
    paymentStatus: str = Field(default="pending")

class Booking(BookingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    user: "User" = Relationship(back_populates="bookings_as_customer", sa_relationship_kwargs={"primaryjoin": "foreign(Booking.userId) == User.id"})
    provider: Optional["User"] = Relationship(back_populates="bookings_as_provider", sa_relationship_kwargs={"primaryjoin": "foreign(Booking.providerId) == User.id"})
    service: "Service" = Relationship(back_populates="bookings")

from .user import User
from .service import Service
