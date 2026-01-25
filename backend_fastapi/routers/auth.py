from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from jose import jwt

from database import get_session
from models import User
from core.security import get_password_hash, verify_password
from core.deps import get_current_user
from core.config import settings
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str = None
    userType: str = "user"
    businessName: str = None
    bio: str = None
    serviceAreas: str = None # Comma separated
    experience: int = 0
    adminKey: str = None # Only for admin

router = APIRouter()

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_session)) -> Any:
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    # Process attributes
    user_dict = user_in.dict(exclude={"password", "adminKey", "serviceAreas"})
    user_dict["hashed_password"] = get_password_hash(user_in.password)
    
    # Handle serviceAreas split
    if user_in.serviceAreas:
        import json
        areas = [area.strip() for area in user_in.serviceAreas.split(",") if area.strip()]
        user_dict["serviceAreas"] = json.dumps(areas)

    user = User(**user_dict)
    
    if user_in.userType == "admin":
         # Add admin key validation logic here if needed
         pass

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {"sub": user.email}
    encoded_jwt = jwt.encode(token_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return {
        "success": True,
        "token": encoded_jwt,
        "user": user
    }

class LoginRequest(BaseModel):
    email: str
    password: str
    userType: str = None # Optional check

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_session)) -> Any:
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {"sub": user.email}
    encoded_jwt = jwt.encode(token_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return {
        "success": True,
        "token": encoded_jwt,
        "user": user
    }

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)) -> Any:
    return {
        "success": True,
        "user": current_user
    }

