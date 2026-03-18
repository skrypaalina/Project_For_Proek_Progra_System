from sqlalchemy import Column, Integer, Enum, DECIMAL, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database import Base


class Payment(Base):
    __tablename__ = "Payments"

    id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("Bookings.id", ondelete="CASCADE"),
        nullable=False
    )

    amount = Column(
        DECIMAL(10, 2),
        nullable=False
    )

    payment_provider = Column(
        Enum('liqpay', 'stripe', 'wayforpay'),
        nullable=False
    )

    transaction_id = Column(
        String(255),
        unique=True,
        nullable=True  # може бути null до оплати
    )

    status = Column(
        Enum('pending', 'success', 'failed', 'refunded'),
        default='pending',
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    # 🔗 ЗВ’ЯЗОК
    booking = relationship("Booking", backref="payment_obj")