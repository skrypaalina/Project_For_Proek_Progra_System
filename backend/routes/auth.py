from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.user import User
from utils.security import hash_password

router = APIRouter()

@router.post("/register")
def register(email: str, password: str):
    db = SessionLocal()

    user = User(
        email=email,
        password_hash=hash_password(password),
        role="customer"
    )

    db.add(user)
    db.commit()

    return {"message": "registered"}

@router.post("/login")
def login(email: str, password: str):
    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user or user.password_hash != hash_password(password):
        raise HTTPException(status_code=401)

    return {"message": "ok", "user_id": user.id}