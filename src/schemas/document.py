from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    id: int
    filename: str
    mime_type: str
    file_size: int
    status: str
    language: str | None = None
    page_count: int | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) #from_attributes=True is particularly useful when working with SQLAlchemy + FastAPI because your database queries return ORM objects rather than dictionaries.