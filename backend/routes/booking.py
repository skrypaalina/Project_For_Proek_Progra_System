from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from backend.database import get_db
from backend.models.booking import Booking
from backend.models.movie import Movie
from backend.models.session import Session as MovieSession

try:
    from backend.models.user import User
except ImportError:
    try:
        from backend.models.users import User
    except ImportError:
        raise ImportError("Не вдалося знайти модель User. Перевір назву файлу в backend/models/")

router = APIRouter()

class TicketRequest(BaseModel):
    session_id: int
    seats: List[int]
    user_id: int

@router.post("/tickets")
async def buy_tickets(req: TicketRequest, db: Session = Depends(get_db)):
    try:
        for seat in req.seats:
            new_booking = Booking(
                session_id=req.session_id,
                user_id=req.user_id,
                seat_number=str(seat)
            )
            db.add(new_booking)
        
        user = db.query(User).filter(User.id == req.user_id).first()
        if user:
            bonuses_to_add = len(req.seats) * 10
            if hasattr(user, 'bonuses'):
                user.bonuses += bonuses_to_add
            elif hasattr(user, 'bonus_points'):
                user.bonus_points += bonuses_to_add

        db.commit() 
        return {"message": "Успішно", "added_bonuses": len(req.seats) * 10}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/{user_id}/tickets")
async def get_user_tickets(user_id: int, db: Session = Depends(get_db)):
    results = db.query(
        Booking.seat_number,
        Movie.title,
        MovieSession.start_time
    ).join(MovieSession, Booking.session_id == MovieSession.id)\
     .join(Movie, MovieSession.movie_id == Movie.id)\
     .filter(Booking.user_id == user_id).all()
    
    return [
        {
            "movie_title": r.title,
            "session_time": r.start_time.strftime("%d.%m %H:%M") if r.start_time else "Скоро",
            "seat": r.seat_number
        } for r in results
    ]