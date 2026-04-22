from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from backend.database import get_db
from backend.models.booking import Booking 

router = APIRouter()

class BookingRequest(BaseModel):
    session_id: int
    seats: List[int]

@router.get("/booking/{session_id}")
def get_taken_seats(session_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.session_id == session_id).all()
    return [b.seat_number for b in bookings]

@router.post("/book")
def book_seats(request: BookingRequest, db: Session = Depends(get_db)):
    try:
        for seat_number in request.seats:
            new_booking = Booking(
                session_id=request.session_id,
                seat_number=seat_number,
                user_id=1 
            )
            db.add(new_booking)
        
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        print(f"!!! ПОМИЛКА: {e}")
        raise HTTPException(status_code=400, detail=str(e))