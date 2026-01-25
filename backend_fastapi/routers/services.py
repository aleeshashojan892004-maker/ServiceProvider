from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Service, User, UserType
from core.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ServiceCreate(BaseModel):
    title: str
    category: str
    description: str
    price: float
    image: str = None

@router.get("/")
def get_services(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_session)
):
    query = select(Service).where(Service.isActive == True)
    if category:
        query = query.where(Service.category == category)
    if search:
        query = query.where(Service.title.contains(search))
        
    services = db.exec(query).all()
    
    # Enrich with provider info manually if needed, or rely on relationship loading
    # SQLModel relationships load lazily by default, often better to return Pydantic models
    return services

@router.get("/{service_id}")
def get_service(service_id: int, db: Session = Depends(get_session)):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/")
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.userType != UserType.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can create services")
        
    service = Service(**service_in.dict(), providerId=current_user.id)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

@router.get("/categories/list")
def get_categories(db: Session = Depends(get_session)):
    # Simple distinct query
    statement = select(Service.category).distinct()
    categories = db.exec(statement).all()
    return categories
