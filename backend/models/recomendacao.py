from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Recomendacao(Base):
    __tablename__ = "recomendacoes"
    
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    vaga_id = Column(Integer, ForeignKey("vagas.id"), nullable=False)
    estrategia = Column(String, nullable=False)  # 'common_interests', 'popular', etc.
    score = Column(Float, nullable=False)  # Score da recomendação (0.0 - 1.0)
    explicacao = Column(Text, nullable=True)  # Explicação da recomendação
    ativa = Column(Boolean, default=True)  # Se a recomendação ainda é válida
    criado_em = Column(TIMESTAMP, default=datetime.now)
    atualizado_em = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    usuario = relationship("User", back_populates="recomendacoes")
    vaga = relationship("Vagas", back_populates="recomendacoes")
    
    def __repr__(self):
        return f"<Recomendacao(usuario_id={self.usuario_id}, vaga_id={self.vaga_id}, estrategia={self.estrategia}, score={self.score})>" 