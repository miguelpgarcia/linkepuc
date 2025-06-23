from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class CandidatoVaga(Base):
    __tablename__ = "candidato_vaga"
    id = Column(Integer, primary_key=True, index=True)
    candidato_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    vaga_id = Column(Integer, ForeignKey("vagas.id"), nullable=False)
    carta_motivacao = Column(Text, nullable=True)
    criado_em = Column(TIMESTAMP, default=datetime.now)

    # Relationships
    candidato = relationship("User", back_populates="candidaturas")
    vaga = relationship("Vagas", back_populates="candidatos") 