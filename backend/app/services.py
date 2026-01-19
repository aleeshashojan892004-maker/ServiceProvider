from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Service
from app.schemas import ServiceCreate, ServiceResponse

router = APIRouter()


@router.post("/services", response_model=ServiceResponse)
def add_service(service: ServiceCreate, db: Session = Depends(get_db)):
    new_service = Service(
        provider_id=service.provider_id,
        title=service.title,
        description=service.description,
        price=service.price
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service
