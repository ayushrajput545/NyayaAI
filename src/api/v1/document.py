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
from src.services.rag_service import indexingPhase
from src.models.document_chunk import DocumentChunk

document_routes = APIRouter(prefix='/documents/api/v1')

#User Upload PDF -> Save PDF and store its path in DB + mark status "uploaded" -> Load PDF -> Chunking -> Generate embeddings -> Store chunks and embedding in DB and mark that document status as "proccessed"
@document_routes.post('/upload', response_model=DocumentResponse , status_code=status.HTTP_201_CREATED)
def upload_document(file:UploadFile , db:Session=Depends(get_db) , current_user:User=Depends(get_current_user)):

    saved_file = save_document(file, str(current_user.id))

    # Check whether this user has already uploaded this PDF
    existing_document = db.query(Document).filter(
        Document.uploaded_by == current_user.id,
        Document.sha256 == saved_file["sha256"] #Why SHA-256? It identifies the file's content. Even if someone renames the same PDF, its hash remains the same.
    ).first()

    if existing_document:
        delete_stored_file(saved_file["storage_key"])

        raise HTTPException(
            status_code=409,
            detail="You have already uploaded this document."
        )

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

        # RAG: Indexing phase starts
        total_chunks = indexingPhase(db, document)

    except Exception as exc:
        db.rollback()
        delete_stored_file(saved_file["storage_key"])
        raise HTTPException(
            status_code=500,
            detail="Unable to save document metadata."
        )

    return {
        "message": "PDF uploaded and processed successfully",
        "document_id": str(document.id),
        "filename": document.filename,
        "total_chunks": total_chunks
    }

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

@document_routes.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    document = db.query(Document).filter(
        Document.id == document_id,
        Document.uploaded_by == current_user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Delete all chunks associated with this document
    db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document.id
    ).delete(synchronize_session=False)

    storage_key = document.storage_key

    # Delete document metadata
    db.delete(document)
    db.commit()

    # Delete the physical PDF
    delete_stored_file(storage_key)

    return {
        "message": "Document deleted successfully"
    }


# Why Re-Indexing??; We use re-indexing when we need to regenerate the document's embeddings and update its searchable chunks without asking the user to upload the PDF again.
# Embedding model changed: Suppose initially you use all-MiniLM-L6-v2, but later switch to another embedding model. Existing embeddings are incompatible with the new model, so you need to regenerate them.
# Chunking strategy changed: Initially, you use 500-character chunks. Later, you decide to use 1000-character chunks with overlap. You need to split and index the document again.
@document_routes.post("/{document_id}/reindex")
def reindex_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.uploaded_by == current_user.id
    ).first()

    # Remove old chunks
    db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document.id
    ).delete(synchronize_session=False)

    document.status = "uploaded"
    db.commit()

    try:
        total_chunks = indexingPhase(db, document)

    except Exception:
        db.rollback()

        document = db.query(Document).filter(
            Document.id == document_id
        ).first()

        if document:
            document.status = "failed"
            db.commit()

        raise HTTPException(
            status_code=500,
            detail="Document re-indexing failed"
        )

    return {
        "message": "Document re-indexed successfully",
        "document_id": str(document.id),
        "total_chunks": total_chunks
    }

