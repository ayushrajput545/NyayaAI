from src.config.db import Base
from sqlalchemy import (
    Column, String, BigInteger, Integer, DateTime,
    ForeignKey, func
)
from sqlalchemy.orm import relationship


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)

    filename = Column(String(500), nullable=False)
    storage_key = Column(String(1000), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    sha256 = Column(String(64), nullable=True)
    status = Column(String(30), default="uploaded", nullable=False)
    language = Column(String(20), nullable=True)
    page_count = Column(Integer, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(), onupdate=func.now())
    owner = relationship("User", back_populates="documents")
    legal_case = relationship("LegalCase", back_populates="documents")

    chunks = relationship( "DocumentChunk",back_populates="document", cascade="all, delete-orphan")

    jobs = relationship("DocumentJob",back_populates="document",cascade="all, delete-orphan")
