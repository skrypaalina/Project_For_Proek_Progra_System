from sqlalchemy import Column, Integer, String, DECIMAL
from backend.database import Base

class Booking(Base):
    __tablename__ = "Bookings"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    seat_number = Column(Integer)
    user_id = Column(Integer)
    booking_type = Column(String)
    status = Column(String)
    total_amount = Column(DECIMAL(10, 2))