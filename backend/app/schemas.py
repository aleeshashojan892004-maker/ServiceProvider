from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    phone: Optional[str] = None
    place: Optional[str] = None
    service_name: str | None = None



class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class BookingCreate(BaseModel):
    provider_id: int
    service_name: str
    booking_date: datetime


class BookingResponse(BaseModel):
    id: int
    user_id: int
    provider_id: int
    service_name: str
    booking_date: datetime
    status: str

    class Config:
        orm_mode = True
