from src.config.db import Base
from sqlalchemy import Column , Integer , String , Text , ForeignKey
from sqlalchemy.orm import relationship

class LegalCase(Base):
    __tablename__ = "legal_cases"

    id = Column(Integer , primary_key=True)
    title = Column(String(150) , nullable=False)
    case_number = Column(String(150) , nullable=True)
    description = Column(Text , nullable= True)
    created_by = Column(Integer , ForeignKey("users.id", ondelete="CASCADE") , nullable=False)

    creator = relationship("User", back_populates="cases")
    documents = relationship("Document", back_populates="legal_case")


