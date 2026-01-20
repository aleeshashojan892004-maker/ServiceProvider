from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Booking, User, ServiceProvider
from app.schemas import BookingCreate

router = APIRouter()


@router.post("/book")
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
):
    user_id = 1  # temp for testing

    # 🔥 FIX: check provider in service_providers table
    provider = (
        db.query(ServiceProvider)
        .filter(ServiceProvider.id == data.provider_id)
        .first()
    )

    if not provider:
        raise HTTPException(status_code=400, detail="Invalid provider")

    booking = Booking(
        user_id=user_id,
        provider_id=data.provider_id,
        service_name=data.service_name,
        booking_date=data.booking_date,
        status="pending",
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking
