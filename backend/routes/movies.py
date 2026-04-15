from fastapi import APIRouter
from backend.database import SessionLocal
from backend.models.movie import Movie # Переконайся, що модель є

router = APIRouter()

@router.get("/movies")
def get_movies():
    db = SessionLocal()
    movies = db.query(Movie).all()
    return movies