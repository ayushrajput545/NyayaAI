
import uuid

from src.config.db import Base
from sqlalchemy import (
    Column, Integer , String, DateTime, ForeignKey, func
)
from sqlalchemy.orm import relationship


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,index=True)
    title = Column(String(255),default="New Conversation",nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message",back_populates="conversation",cascade="all, delete-orphan")
