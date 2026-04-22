from sqlalchemy import Column, Integer, String, Text 
from backend.database import Base

class Movie(Base):
    __tablename__ = "Movies"

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    description = Column(String)
    poster_url = Column(Text) 