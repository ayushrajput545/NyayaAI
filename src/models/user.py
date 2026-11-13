from src.config.db import Base
from sqlalchemy import Column , Integer , String , Boolean 
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer , primary_key=True)
    name = Column(String(150) , nullable=False)
    email = Column(String(255) , unique=True , index=True , nullable=True)
    hashed_password = Column(String(255) , nullable=False)
    is_verified = Column(Boolean , default=False , nullable=False)

    documents = relationship("Document", back_populates="owner") #this is just for understanding the relationshio of user table with other tables
    cases = relationship("LegalCase", back_populates="creator")
    conversations = relationship("Conversation", back_populates="user")
    email_otps = relationship("EmailOTP", back_populates="user")


