from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class InteresseVaga(Base):
    __tablename__ = "interesse_vaga"
    id = Column(Integer, primary_key=True, index=True)
    interesse_id = Column(Integer, ForeignKey("interesses.id"), nullable=False)
    vaga_id = Column(Integer, ForeignKey("vagas.id"), nullable=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)

    interesse = relationship("Interesses", back_populates="vagas")
    vaga = relationship("Vagas", back_populates="interesses")