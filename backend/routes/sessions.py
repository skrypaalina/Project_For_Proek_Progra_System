from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.session import Session as SessionModel

router = APIRouter()

@router.get("/movies/{movie_id}/sessions")
def get_movie_sessions(movie_id: int, db: Session = Depends(get_db)):
    sessions = db.query(SessionModel).filter(SessionModel.movie_id == movie_id).all()
    return sessions