from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


# -------------------------
# USER TABLE (LOGIN USERS)
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    phone = Column(String, nullable=True)
    place = Column(String, nullable=True)


# -------------------------
# SERVICE PROVIDER TABLE
# -------------------------
class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    place = Column(String, nullable=True)

    # One provider → many services
    services = relationship("Service", back_populates="provider")


# -------------------------
# SERVICES TABLE
# -------------------------
class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id"))
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)

    provider = relationship("ServiceProvider", back_populates="services")
