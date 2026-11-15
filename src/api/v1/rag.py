from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.config.db import get_db
from src.models.user import User
from src.core.dependencies import get_current_user
from src.services.rag_service import ask_question


rag_routes = APIRouter(prefix="/rag/api/v1")

class AskQueRequest(BaseModel):
    question: str

@rag_routes.post('/ask_que')
def search_documennt( body: AskQueRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = ask_question(
        db,
        body.question,
        current_user.id
    )

    return result




