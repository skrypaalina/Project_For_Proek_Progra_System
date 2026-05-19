from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routes import auth, movies, sessions, booking, payments
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Підключаємо роутери правильно (вони мають вищий пріоритет)
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(movies.router, prefix="/api", tags=["movies"])
app.include_router(sessions.router, prefix="/api", tags=["sessions"])
app.include_router(booking.router, prefix="/api", tags=["booking"])
app.include_router(payments.router, prefix="/api", tags=["payments"])

# ВИПРАВЛЕНО: Замість всього кореня монтуємо ТІЛЬКИ папку Frontend для доступу до картинок аватарок та постерів
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Frontend"))
app.mount("/Frontend", StaticFiles(directory=frontend_path), name="frontend")