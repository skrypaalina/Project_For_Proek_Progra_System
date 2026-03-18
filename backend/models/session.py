from sqlalchemy import Column, Integer, DateTime
from database import Base

class Session(Base):
    __tablename__ = "Sessions"

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer)
    hall_id = Column(Integer)
    start_time = Column(DateTime)