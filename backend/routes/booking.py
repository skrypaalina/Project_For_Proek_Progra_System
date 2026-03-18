from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.ticket import Ticket

router = APIRouter()

@router.post("/book")
def book(booking_id: int, session_id: int, seat_id: int):
    db = SessionLocal()

    ticket = Ticket(
        booking_id=booking_id,
        session_id=session_id,
        seat_id=seat_id
    )

    try:
        db.add(ticket)
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=400, detail="Seat taken")

    return {"message": "booked"}