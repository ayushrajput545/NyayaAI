from fastapi import APIRouter, Depends ,HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.config.db import get_db
from src.models.user import User
from src.core.dependencies import get_current_user
from src.services.rag_service import ask_question


rag_routes = APIRouter(prefix="/rag/api/v1")

class AskQueRequest(BaseModel):
    question: str
    conversation_id: int | None = None 
    document_id: int | None = None

@rag_routes.post('/ask_que')
def search_documennt( body: AskQueRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = ask_question(
        db,
        body.question,
        current_user.id,
        body.conversation_id, #by default cit is null , we pass conversation id from frontend after saving it in state that is present in previous message
        body.document_id # allow llm to generate ans stricltly from user's uploaded pdf not from any other admin document
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found."
        )

    return result




