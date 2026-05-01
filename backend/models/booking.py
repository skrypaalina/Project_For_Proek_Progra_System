from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from backend.database import Base
import datetime

class Booking(Base):
    __tablename__ = "bookings" 

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id')) 
    session_id = Column(Integer, ForeignKey('sessions.id')) 
    seat_number = Column(String(10))
