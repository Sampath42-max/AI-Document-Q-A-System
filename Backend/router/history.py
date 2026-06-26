from fastapi import APIRouter, Header
from Database import get_chats, clear_chats

router = APIRouter()

@router.get("/history/{doc_id}")
async def get_history(doc_id: str, x_user_id: str = Header(default="default")):
    return get_chats(doc_id, user_id=x_user_id)

@router.delete("/history/{doc_id}")
async def clear_history(doc_id: str, x_user_id: str = Header(default="default")):
    clear_chats(doc_id, user_id=x_user_id)
    return {"message": "Chat history cleared successfully"}