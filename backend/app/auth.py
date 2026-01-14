from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, ServiceProvider
from app.schemas import RegisterRequest, LoginRequest
from app.utils import hash_password, verify_password

router = APIRouter()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    print("REGISTER API HIT")

    # ---------- USER REGISTRATION ----------
    if data.role == "user":
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(
            name=data.name,
            email=data.email,
            password=hash_password(data.password)
        )
        db.add(user)

    # ---------- SERVICE PROVIDER REGISTRATION ----------
    elif data.role == "provider":
        existing = db.query(ServiceProvider).filter(
            ServiceProvider.email == data.email
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        provider = ServiceProvider(
            name=data.name,
            email=data.email,
            password=hash_password(data.password),
            phone=data.phone,
            place=data.place,
            service_name=data.service_name,

        )
        db.add(provider)

    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {"message": "Registration successful"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    # ---------- USER LOGIN ----------
    if data.role == "user":
        user = db.query(User).filter(User.email == data.email).first()

    # ---------- PROVIDER LOGIN ----------
    elif data.role == "provider":
        user = db.query(ServiceProvider).filter(
            ServiceProvider.email == data.email
        ).first()

    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "role": data.role,
        "name": user.name,
        "email": user.email,
        "id": user.id
    }
