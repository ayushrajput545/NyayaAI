from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.config.db import get_db
from src.models.user import User
from src.core.dependencies import get_current_user
from src.services.document_summery_service import summarize_document

summary_routes = APIRouter(prefix="/document")

@summary_routes.post("/{document_id}/summary")
def generate_document_summary(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    summary = summarize_document(
        db,
        document_id,
        current_user.id
    )

    if summary is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found or no indexed chunks available."
        )

    return {
        "document_id": str(document_id),
        "summary": summary
    }
