from sqlalchemy import Column, Integer, String
from .base import Base

class Tipo(Base):
    __tablename__ = "tipo"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, unique=True)