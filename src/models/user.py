from src.config.db import Base
from sqlalchemy import Column , Integer , String
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer , primary_key=True)
    name = Column(String(150) , nullable=False)
    email = Column(String(255) , unique=True , index=True , nullable=True)
    hashed_password = Column(String(255) , nullable=False)

    documents = relationship("Document", back_populates="owner") #this is just for understanding the relationshio of user table with other tables
    


