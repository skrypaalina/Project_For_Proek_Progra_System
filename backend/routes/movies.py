from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Імпорт бази даних та моделей
from backend.database import get_db
from backend.models.movie import Movie
from backend.models.session import Session as MovieSession # Імпортуємо модель сеансів

router = APIRouter()

@router.get("/movies")
def get_all_movies(db: Session = Depends(get_db)):
    """Отримати список усіх фільмів"""
    movies = db.query(Movie).all()
    return movies

@router.get("/movies/{movie_id}")
def get_movie_by_id(movie_id: int, db: Session = Depends(get_db)):
    """Отримати детальну інформацію про один фільм"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Фільм не знайдено")
    return movie

@router.get("/movies/{movie_id}/sessions")
def get_movie_sessions(movie_id: int, db: Session = Depends(get_db)):
    """
    Отримати всі сеанси для конкретного фільму.
    Саме цей роут шукає твій фронтенд і отримує 404.
    """
    # Шукаємо сеанси, що належать цьому фільму
    sessions = db.query(MovieSession).filter(MovieSession.movie_id == movie_id).all()
    
    # Якщо сеансів немає, повертаємо порожній список [], 
    # щоб фронтенд міг просто написати "Сеансів немає"
    return sessions