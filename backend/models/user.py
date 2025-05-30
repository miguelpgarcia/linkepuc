from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class User(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    ehaluno = Column(Boolean, nullable=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)
    avatar = Column(String, nullable=True)
    interesses = relationship("InteresseUsuario", back_populates="usuario")

    vagas = relationship("Vagas", back_populates="autor")  # Add back-reference to Vagas