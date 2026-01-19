from pydantic import BaseModel, EmailStr

# ---------- AUTH ----------

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    phone: str | None = None
    place: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------- SERVICES ----------

class ServiceCreate(BaseModel):
    provider_id: int
    title: str
    description: str | None = None
    price: float


class ServiceResponse(BaseModel):
    id: int
    provider_id: int
    title: str
    description: str | None
    price: float

    class Config:
        from_attributes = True
