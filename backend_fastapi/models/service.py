from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
# from .user import User

class ServiceBase(SQLModel):
    title: str
    category: str
    description: Optional[str] = ""
    price: float
    image: Optional[str] = ""
    rating: float = Field(default=0.0)
    reviews: int = Field(default=0)
    isActive: bool = Field(default=True)
    providerId: Optional[int] = Field(default=None, foreign_key="user.id")

class Service(ServiceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    provider: Optional["User"] = Relationship(back_populates="services")
    bookings: list["Booking"] = Relationship(back_populates="service")

from .booking import Booking
from .user import User
