from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database import get_db
from backend.models.booking import Booking 

router = APIRouter()

@router.get("/movies/{movie_id}/sessions")
def get_movie_sessions(movie_id: int, db: Session = Depends(get_db)):
    """Отримання всіх сеансів для конкретного фільму"""
    try:
        query = text("""
            SELECT id, movie_id, start_time, base_price 
            FROM Sessions 
            WHERE movie_id = :movie_id
        """)
        result = db.execute(query, {"movie_id": movie_id}).fetchall()
        
        sessions = []
        for r in result:
            sessions.append({
                "id": r.id,
                "movie_id": r.movie_id,
                "start_time": r.start_time.isoformat() if hasattr(r.start_time, 'isoformat') else str(r.start_time),
                "base_price": float(r.base_price)
            })
        return sessions
    except Exception as e:
        print(f"ПОМИЛКА ОТРИМАННЯ СЕАНСІВ: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка бази даних: {str(e)}")

@router.get("/sessions/{session_id}/seats")
def get_seats(session_id: int, db: Session = Depends(get_db)):
    # 1. Отримуємо список номерів уже куплених місць із бази
    booked_seats = db.query(Booking.seat_number).filter(Booking.session_id == session_id).all()
    # Перетворюємо список кортежів [(1,), (2,)] у простий список [1, 2]
    taken_numbers = [s[0] for s in booked_seats]

    seats = []
    for i in range(1, 51):
        is_available = True
        
        if i in taken_numbers:
            is_available = False
            
        seats.append({
            "id": i,
            "seat_number": i,
            "is_available": is_available,
            "price": 150
        })
    
    return seats