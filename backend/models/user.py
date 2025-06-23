from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, Text
from sqlalchemy.orm import relationship
from .interesse_usuario import InteresseUsuario
from datetime import datetime
from .base import Base

class User(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)
    usuario = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    ehaluno = Column(Boolean, nullable=False)
    sobre = Column(Text, nullable=True)
    criado_em = Column(TIMESTAMP, default=datetime.now)
    avatar = Column(String, nullable=True)
    email_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_token_expires = Column(TIMESTAMP, nullable=True)
    interesses = relationship("InteresseUsuario", back_populates="usuario")

    vagas = relationship("Vagas", back_populates="autor")  # Add back-reference to Vagas
    historicos = relationship("Historico", back_populates="user")  # Add back-reference to Historico
    candidaturas = relationship("CandidatoVaga", back_populates="candidato")  # Add relationship to candidaturas

    mensagens_enviadas = relationship("Mensagem", foreign_keys="[Mensagem.remetente_id]", back_populates="remetente")
    mensagens_recebidas = relationship("Mensagem", foreign_keys="[Mensagem.destinatario_id]", back_populates="destinatario")
    recomendacoes = relationship("Recomendacao", back_populates="usuario")