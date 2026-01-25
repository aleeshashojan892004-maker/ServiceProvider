from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Booking, BookingStatus, User
from core.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

class BookingCreate(BaseModel):
    serviceId: int
    bookingDate: datetime
    bookingTime: str
    address: str
    totalAmount: float

@router.post("/")
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get service to find provider
    from models import Service
    service = db.get(Service, booking_in.serviceId)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
        
    booking = Booking(
        **booking_in.dict(),
        userId=current_user.id,
        providerId=service.providerId, # Assign to service provider
        status=BookingStatus.PENDING
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/my-bookings")
def get_my_bookings(
    status: Optional[str] = None,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    query = select(Booking).where(Booking.userId == current_user.id)
    if status:
        query = query.where(Booking.status == status)
        
    bookings = db.exec(query).all()
    return bookings

@router.get("/{booking_id}")
def get_booking(
    booking_id: int, 
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    # Security check
    if booking.userId != current_user.id and booking.providerId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        
    return booking
