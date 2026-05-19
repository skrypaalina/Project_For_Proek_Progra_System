from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import text
import shutil
import os

from backend.database import get_db
from backend.models.movie import Movie 

router = APIRouter()

@router.get("/movies")
def get_all_movies(db: Session = Depends(get_db)):
    """Отримання всіх фільмів для головної та адмінки"""
    movies = db.query(Movie).all()
    
    return [
        {
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "poster_url": m.poster_url
        }
        for m in movies
    ]

# --- ОСЬ ЦЕЙ ЕНДПОЇНТ БУВ ПРОПУЩЕНИЙ! ДОДАНО ДЛЯ СТОРІНКИ ФІЛЬМУ ---
@router.get("/movies/{movie_id}")
def get_single_movie(movie_id: int, db: Session = Depends(get_db)):
    """Отримання даних одного конкретного фільму за ID"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Фільм не знайдено")
    
    return {
        "id": movie.id,
        "title": movie.title,
        "description": movie.description,
        "poster_url": movie.poster_url
    }

UPLOAD_POSTER_DIR = "Frontend/images/posters"
os.makedirs(UPLOAD_POSTER_DIR, exist_ok=True)

@router.post("/movies")
async def create_movie(
    title: str = Form(...),
    description: str = Form(...),
    poster: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Створення фільму з обходом помилки моделей"""
    try:
        poster_url = "images/posters/default.jpg"  # Якщо файл не вибрано

        if poster:
            file_path = os.path.join(UPLOAD_POSTER_DIR, poster.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(poster.file, buffer)
            poster_url = f"images/posters/{poster.filename}"

        # Записуємо фільм через чистий SQL, щоб обійти застарілу модель Movie в Python
        query = text("""
            INSERT INTO Movies (title, description, poster_url, duration_minutes) 
            VALUES (:title, :description, :poster_url, 120)
        """)
        db.execute(query, {"title": title, "description": description, "poster_url": poster_url})
        db.commit()
        
        return {"status": "success"}

    except Exception as e:
        db.rollback()
        print(f"КРИТИЧНА ПОМИЛКА ДОДАВАННЯ ФІЛЬМУ: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/movies/{movie_id}")
async def update_movie(
    movie_id: int,
    title: str = Form(...),
    description: str = Form(...),
    poster: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Редагування фільму через сирий SQL"""
    try:
        movie = db.query(Movie).filter(Movie.id == movie_id).first()
        if not movie:
            raise HTTPException(status_code=404, detail="Фільм не знайдено")

        if poster:
            file_path = os.path.join(UPLOAD_POSTER_DIR, poster.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(poster.file, buffer)
            poster_url = f"images/posters/{poster.filename}"
            
            query = text("""
                UPDATE Movies 
                SET title = :title, description = :description, poster_url = :poster_url 
                WHERE id = :movie_id
            """)
            db.execute(query, {"title": title, "description": description, "poster_url": poster_url, "movie_id": movie_id})
        else:
            query = text("""
                UPDATE Movies 
                SET title = :title, description = :description 
                WHERE id = :movie_id
            """)
            db.execute(query, {"title": title, "description": description, "movie_id": movie_id})

        db.commit()
        return {"message": "updated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))