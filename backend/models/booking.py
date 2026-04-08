from sqlalchemy import Column, Integer, Enum, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from backend.database import Base

class Booking(Base):
    __tablename__ = "Bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("Users.id", ondelete="CASCADE"),
        nullable=False
    )

    booking_type = Column(
        Enum('seats', 'whole_hall'),
        default='seats',
        nullable=False
    )

    status = Column(
        Enum('pending', 'confirmed', 'cancelled'),
        default='pending',
        nullable=False
    )

    total_amount = Column(
        DECIMAL(10, 2),
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    # 🔗 ЗВ’ЯЗКИ
    tickets = relationship(
        "Ticket",
        backref="booking",
        cascade="all, delete"
    )

    payments = relationship(
        "Payment",
        backref="booking",
        cascade="all, delete"
    )