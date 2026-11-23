from fastapi import APIRouter, Depends ,HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.config.db import get_db
from src.models.user import User
from src.core.dependencies import get_current_user
from src.models.document import Document
from src.services.rag_service import ask_question
from src.agents.graph_service import ask_question_with_graph


rag_routes = APIRouter(prefix="/rag/api/v1")

class AskQueRequest(BaseModel):
    question: str
    conversation_id: int | None = None 
    document_id: int | None = None
    use_multi_agent: bool = False
    use_my_doc:bool=False

@rag_routes.post('/ask_que')
def search_documennt( body: AskQueRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if body.use_my_doc:
        if body.document_id is None:
            raise HTTPException(
                status_code=422,
                detail="document_id is required when use_my_doc is true.",
            )

        document = db.query(Document).filter(
            Document.id == body.document_id,
            Document.uploaded_by == current_user.id,
        ).first()
        if document is None:
            raise HTTPException(
                status_code=404,
                detail="Document not found.",
            )

    if body.use_multi_agent:
        # Multi-Agent Flow
        result = ask_question_with_graph(
            db,
            body.question,
            current_user.id,
            body.conversation_id,
            body.document_id,
            body.use_my_doc,
        )

    else:
        # RAG Flow
        result = ask_question(
            db,
            body.question,
            current_user.id,
            body.conversation_id, #by default cit is null , we pass conversation id from frontend after saving it in state that is present in previous message
            body.document_id, # allow llm to generate ans stricltly from user's uploaded pdf not from any other admin document
            body.use_my_doc
        )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found."
        )

    return result







