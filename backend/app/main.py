# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.bookings import router as booking_router
# from app.database import Base, engine
# from app.auth import router as auth_router
# import app.models  # 👈 ADD THIS

# Base.metadata.create_all(bind=engine)

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth_router, prefix="/api/auth")

# app.include_router(booking_router, prefix="/api/bookings")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.auth import router as auth_router
from app.bookings import router as booking_router   # ✅ THIS LINE

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(booking_router, prefix="/api/bookings")  # ✅

@app.get("/")
def root():
    return {"status": "FastAPI backend running"}
