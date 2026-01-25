from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import User
from core.deps import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None # String or JSON
    businessName: Optional[str] = None
    bio: Optional[str] = None
    serviceAreas: Optional[str] = None # Comma separated for simplicity in update
    experience: Optional[int] = None

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {"success": True, "user": current_user}

@router.put("/profile")
def update_profile(
    user_in: UserUpdate, 
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    update_data = user_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "serviceAreas":
             # Handle special conversion if needed, or store as is
             pass
        setattr(current_user, field, value)
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return {"success": True, "user": current_user}

