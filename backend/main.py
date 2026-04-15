from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routes import auth, movies, sessions, booking, payments
from backend.routes import movies
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(movies.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(booking.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(movies.router)

frontend_path = os.path.join(os.path.dirname(__file__), "..", "Frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")