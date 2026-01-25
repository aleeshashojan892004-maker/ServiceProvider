from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from database import create_db_and_tables
from routers import auth, user, services, bookings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# CORS Configuration
origins = [
    "http://localhost:5173", # Frontend
    "http://localhost:5174", # Frontend alternative
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
app.include_router(services.router, prefix="/api/services", tags=["services"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])

@app.get("/api/health")
def health_check():
    return {
        "status": "OK",
        "message": "FastAPI Server is running",
        "database": "SQLite (SQLModel)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
