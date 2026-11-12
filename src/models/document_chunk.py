
from pgvector.sqlalchemy import Vector
from src.config.db import Base
from sqlalchemy import (
    Column, Integer, JSON, String, Text,
    DateTime, ForeignKey, UniqueConstraint, func
)
from sqlalchemy.orm import relationship


# model='gemini-embedding-001'
EMBEDDING_DIMENSION = 3072


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

   #IMP1
    __table_args__ = (UniqueConstraint("document_id","chunk_index",name="uq_document_chunk_index"),)  #Suppose your background processing job accidentally runs twice and tries to insert chunk 2 again.
                                                                                                     # without this contraint : Duplicate chunks can be inserted , Semantic search may return duplicate results , Your RAG pipeline may retrieve repeated context ; With the constraint:PostgreSQL rejects the duplicate combination , Your data remains consistent

    id = Column(Integer, primary_key=True)
    document_id = Column(Integer,ForeignKey("documents.id", ondelete="CASCADE"),nullable=False,index=True)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    section_title = Column(String(500), nullable=True)
    # Additional extraction metadata
    chunk_metadata = Column(JSON, nullable=True)
    embedding = Column(Vector(EMBEDDING_DIMENSION), nullable=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now())

    document = relationship("Document", back_populates="chunks")
    citations = relationship("Citation", back_populates="chunk")
