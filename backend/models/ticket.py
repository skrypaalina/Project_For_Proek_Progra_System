from sqlalchemy import Column, Integer
from backend.database import Base

class Ticket(Base):
    __tablename__ = "Tickets"

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer)
    session_id = Column(Integer)
    seat_id = Column(Integer)