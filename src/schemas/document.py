from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    message: str
    document_id: str
    filename: str
    total_chunks: int
