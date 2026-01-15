from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models              # 👈 THIS LINE IS CRITICAL
from app.auth import router as auth_router
from app.services import router as services_router

# 👇 create tables AFTER models are imported
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router, prefix="/api/auth")
app.include_router(services_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "FastAPI backend running"}
