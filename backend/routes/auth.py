from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
import shutil
import os

# Імпорт твоєї бази та моделей
from backend.database import get_db, SessionLocal
from backend.models.user import User
from backend.utils.security import hash_password

# Ініціалізація роутера (ОБОВ'ЯЗКОВО)
router = APIRouter()

# Шлях до папки завантажень відносно кореня проекту
UPLOAD_DIR = "Frontend/images/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
        "bonuses": user.bonuses or 0,
        "photo_url": getattr(user, 'photo_url', None) # Повертаємо фото, якщо воно є в базі
    }

@router.post("/users/{user_id}/upload-avatar")
async def upload_avatar(user_id: int, avatar: UploadFile = File(...), db: Session = Depends(get_db)):
    """Завантаження фото користувача та збереження шляху в БД"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    if not avatar.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Можна завантажувати тільки зображення")

    # Формуємо унікальне ім'я файлу, щоб уникнути збігів (наприклад: avatar_1.jpg)
    file_extension = os.path.splitext(avatar.filename)[1]
    unique_filename = f"avatar_{user_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Зберігаємо файл на диск ноутбука
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(avatar.file, buffer)
        
        # Шлях до фото відносно папки Frontend для відображення в браузері
        web_photo_url = f"images/avatars/{unique_filename}"
        
        # Записуємо новий шлях до фото в базу даних користувачу
        user.photo_url = web_photo_url
        db.commit()
        db.refresh(user)

        return {"message": "success", "photo_url": web_photo_url}

    except Exception as e:
        db.rollback()
        print(f"КРИТИЧНА ПОМИЛКА ЗБЕРЕЖЕННЯ АВАТАРКИ: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка бази даних при збереженні файлу: {str(e)}")

@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Реєстрація нового користувача"""
    print(f"DEBUG: Спроба реєстрації: {data.email}")
    
    # Перевірка, чи існує такий email
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Цей email вже зареєстровано")

    try:
        # ВИПРАВЛЕНО: Прибрали поле role, яке ламало базу даних
        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            first_name=data.first_name,
            bonuses=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": "registered", "user_id": user.id}
    except Exception as e:
        db.rollback()
        print(f"КРИТИЧНА ПОМИЛКА БАЗИ ДАНИХ ПРИ РЕЄСТРАЦІЇ: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка при збереженні в базу: {str(e)}")

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