from fastapi import APIRouter
from database import SessionLocal
from models.session import Session

router = APIRouter()

@router.get("/sessions/{movie_id}")
def get_sessions(movie_id: int):
    db = SessionLocal()
    return db.query(Session).filter(Session.movie_id == movie_id).all()