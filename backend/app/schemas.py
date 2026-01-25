from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    phone: str | None = None
    service_name: str | None = None
    place: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
