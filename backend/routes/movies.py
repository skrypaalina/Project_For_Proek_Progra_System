from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.movie import Movie

router = APIRouter()

@router.get("/movies")
def get_all_movies(db: Session = Depends(get_db)):
    movies = db.query(Movie).all()
    return movies

@router.get("/movies/{movie_id}")
def get_movie_by_id(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    
    if not movie:
        raise HTTPException(status_code=404, detail="Фільм не знайдено")
        
    return movie