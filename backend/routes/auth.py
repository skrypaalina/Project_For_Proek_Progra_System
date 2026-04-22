from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.database import SessionLocal
from backend.models.user import User
from backend.utils.security import hash_password

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str 

@router.post("/register")
def register(data: UserRegister):
    db = SessionLocal()
    print(f"DEBUG: Спроба реєстрації: {data.email}")
    try:
        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            first_name=data.first_name,
            role="customer"
        )
        db.add(user)
        db.commit()
        return {"message": "registered"}
    except Exception as e:
        db.rollback()
        print(f"DEBUG ERROR: {e}")
        raise HTTPException(status_code=500, detail="Цей email вже зареєстровано або помилка бази")
    finally:
        db.close()

@router.post("/login")
def login(data: UserLogin):
    db = SessionLocal()
    print(f"DEBUG: Спроба входу: {data.email}")
    try:
        # Шукаємо користувача
        user = db.query(User).filter(User.email == data.email).first()
        
        if not user or user.password_hash != hash_password(data.password):
            print("DEBUG: Невірний пароль або email")
            raise HTTPException(status_code=401, detail="Неправильний email або пароль")
        
        print(f"DEBUG: Успішний вхід для ID {user.id}")
        return {"message": "ok", "user_id": user.id, "first_name": user.first_name}
    finally:
        db.close()