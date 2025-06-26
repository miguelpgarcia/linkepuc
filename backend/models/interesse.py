from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Interesses(Base):
    __tablename__ = "interesses"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=True)
    criado_em = Column(TIMESTAMP, default=datetime.now)
    usuarios = relationship("InteresseUsuario", back_populates="interesse")
    vagas = relationship("InteresseVaga", back_populates="interesse")
