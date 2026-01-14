# # app/models.py
# from sqlalchemy import Column, Integer, String, ForeignKey
# from app.database import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password = Column(String, nullable=False)
#     role = Column(String, nullable=False)
#     phone = Column(String, nullable=True)
#     service_name = Column(String, nullable=True)
#     place = Column(String, nullable=True)


# class Service(Base):
#     __tablename__ = "services"

#     id = Column(Integer, primary_key=True, index=True)
#     provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     service_name = Column(String, nullable=False)
#     description = Column(String, nullable=True)
#     price = Column(String, nullable=True)
from sqlalchemy import Column, Integer, String
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    place = Column(String, nullable=True)
    service_name = Column(String, nullable=True)

