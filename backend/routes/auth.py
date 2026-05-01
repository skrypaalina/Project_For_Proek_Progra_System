from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Імпорт твоєї бази та моделей
from backend.database import get_db, SessionLocal
from backend.models.user import User
from backend.utils.security import hash_password

# Ініціалізація роутера (ОБОВ'ЯЗКОВО)
router = APIRouter()

# Схеми даних (Pydantic моделі)
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str 

# --- ЕНДПОІНТИ ---

@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Отримання даних користувача для профілю"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")
    
    return {
        "first_name": user.first_name,
        "last_name": getattr(user, 'last_name', ''), # Безпечне отримання, якщо поля немає
        "bonuses": user.bonuses or 0
    }

@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Реєстрація нового користувача"""
    print(f"DEBUG: Спроба реєстрації: {data.email}")
    
    # Перевірка, чи існує такий email
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Цей email вже зареєстровано")

    try:
        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            first_name=data.first_name,
            role="customer",
            bonuses=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": "registered", "user_id": user.id}
    except Exception as e:
        db.rollback()
        print(f"DEBUG ERROR: {e}")
        raise HTTPException(status_code=500, detail="Помилка при збереженні в базу")

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Вхід у систему"""
    print(f"DEBUG: Спроба входу: {data.email}")
    
    user = db.query(User).filter(User.email == data.email).first()
    
    # Перевірка пароля (порівнюємо хеші)
    if not user or user.password_hash != hash_password(data.password):
        print("DEBUG: Невірний пароль або email")
        raise HTTPException(status_code=401, detail="Неправильний email або пароль")
    
    print(f"DEBUG: Успішний вхід для ID {user.id}")
    return {
        "message": "ok", 
        "user_id": user.id, 
        "first_name": user.first_name
    }