from sqlalchemy import Column, Integer, String
from database import Base

class Movie(Base):
    __tablename__ = "Movies"

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    description = Column(String)