from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Mensagem(Base):
    __tablename__ = "mensagens"
    id = Column(Integer, primary_key=True, index=True)
    remetente_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    destinatario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    conteudo = Column(Text, nullable=False)
    lida = Column(Boolean, default=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)

    # Relationships
    remetente = relationship("User", foreign_keys=[remetente_id], back_populates="mensagens_enviadas")
    destinatario = relationship("User", foreign_keys=[destinatario_id], back_populates="mensagens_recebidas") 