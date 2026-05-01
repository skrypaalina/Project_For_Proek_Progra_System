from sqlalchemy import Column, Integer, ForeignKey, DateTime, DECIMAL
from backend.database import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    hall_id = Column(Integer)
    start_time = Column(DateTime)
    base_price = Column(DECIMAL(10, 2))