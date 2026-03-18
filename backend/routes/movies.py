from fastapi import APIRouter
from database import SessionLocal
from models.movie import Movie

router = APIRouter()

@router.get("/movies")
def get_movies():
    db = SessionLocal()
    return db.query(Movie).all()