from fastapi import FastAPI , Depends , APIRouter , HTTPException , UploadFile , Query , status
from src.schemas.document import DocumentResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.config.db import get_db
from src.models.user import User
from src.models.document import Document
from src.core.dependencies import get_current_user
from src.services.document_service import (save_document,get_document_path,delete_stored_file)
from fastapi.responses import FileResponse

document_routes = APIRouter(prefix='/documents/api/v1')

@document_routes.post('/upload', response_model=DocumentResponse , status_code=status.HTTP_201_CREATED)
def upload_document(file:UploadFile , db:Session=Depends(get_db) , current_user:User=Depends(get_current_user)):

    saved_file = save_document(file, str(current_user.id))

    document = Document(
        filename=saved_file["filename"],
        storage_key=saved_file["storage_key"],
        mime_type=saved_file["mime_type"],
        file_size=saved_file["file_size"],
        sha256=saved_file["sha256"],
        uploaded_by=current_user.id,
        status="uploaded",
    )

    try:
        db.add(document)
        db.commit()
        db.refresh(document)
    except Exception as exc:
        db.rollback()
        delete_stored_file(saved_file["storage_key"])
        raise HTTPException(
            status_code=500,
            detail="Unable to save document metadata."
        )

    return document

@document_routes.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int , db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    document = db.scalar(select(Document).where(Document.id == document_id , Document.uploaded_by == current_user.id))

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return document

@document_routes.get("/{document_id}/download")
def download_document(document_id:int , db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    document = db.scalar(select(Document).where(Document.id == document_id, Document.uploaded_by == current_user.id))
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    file_path = get_document_path(document.storage_key)

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Stored document file not found."
        )

    return FileResponse(
        path=file_path,
        media_type=document.mime_type,
        filename=document.filename,
    )
