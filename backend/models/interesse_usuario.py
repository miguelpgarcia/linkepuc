from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class InteresseUsuario(Base):
    __tablename__ = "interesse_usuario"
    id = Column(Integer, primary_key=True, index=True)
    interesse_id = Column(Integer, ForeignKey("interesses.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)

    interesse = relationship("Interesses", back_populates="usuarios")
    usuario = relationship("User", back_populates="interesses")
