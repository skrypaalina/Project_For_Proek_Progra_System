from fastapi import APIRouter

router = APIRouter()

@router.post("/pay")
def pay():
    return {"status": "success"}