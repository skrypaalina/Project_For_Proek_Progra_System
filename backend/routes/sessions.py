from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.booking import Booking 

router = APIRouter()

@router.get("/sessions/{session_id}/seats")
def get_seats(session_id: int, db: Session = Depends(get_db)):
    # 1. Отримуємо список номерів уже куплених місць із бази
    booked_seats = db.query(Booking.seat_number).filter(Booking.session_id == session_id).all()
    # Перетворюємо список кортежів [(1,), (2,)] у простий список [1, 2]
    taken_numbers = [s[0] for s in booked_seats]

    seats = []
    # 2. Генеруємо місця (наприклад, 50 штук)
    for i in range(1, 51):
        is_available = True
        
        # Якщо номер місця є в списку куплених — воно більше не доступне
        if i in taken_numbers:
            is_available = False
            
        seats.append({
            "id": i,
            "seat_number": i,
            "is_available": is_available,
            "price": 150
        })
    
    return seats