from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
import json

class UserType(str, Enum):
    USER = "user"
    PROVIDER = "provider"
    ADMIN = "admin"

class UserBase(SQLModel):
    name: str
    email: str = Field(unique=True, index=True)
    phone: Optional[str] = None
    userType: UserType = Field(default=UserType.USER)
    
    # Provider fields
    businessName: Optional[str] = None
    bio: Optional[str] = None
    experience: int = Field(default=0)
    
    # JSON strings (SQLite doesn't have native JSON)
    location_json: Optional[str] = Field(default=None, alias="location")
    serviceAreas_json: Optional[str] = Field(default=None, alias="serviceAreas")
    
    verified: bool = Field(default=False)
    profilePic: Optional[str] = None

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    
    # Relationships
    services: List["Service"] = Relationship(back_populates="provider")
    bookings_as_customer: List["Booking"] = Relationship(back_populates="user", sa_relationship_kwargs={"primaryjoin": "User.id==Booking.userId"})
    bookings_as_provider: List["Booking"] = Relationship(back_populates="provider", sa_relationship_kwargs={"primaryjoin": "User.id==Booking.providerId"})


from .service import Service
from .booking import Booking
