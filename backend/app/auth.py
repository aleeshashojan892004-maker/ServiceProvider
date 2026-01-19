from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import RegisterRequest, LoginRequest
from app.utils import hash_password, verify_password

router = APIRouter()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    print("REGISTER API HIT")

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # ✅ HASH PASSWORD (THIS WAS MISSING)
    hashed_password = hash_password(data.password)

    user = User(
        name=data.name,
        email=data.email,
        password=hashed_password,
        role=data.role,
        phone=data.phone,
        place=data.place,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Registration successful"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "role": user.role,
        "name": user.name,
        "email": user.email,
    }
