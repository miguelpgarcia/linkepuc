from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base
from .user import User
from .tipo_vaga import Tipo  # Import the Tipo model

class Vagas(Base):
    __tablename__ = "vagas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, nullable=False)
    prazo = Column(Date, nullable=False)
    autor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo_id = Column(Integer, ForeignKey("tipo.id"), nullable=False)  # New column
    remuneracao = Column(Integer, nullable=True)  # New column
    horas_complementares = Column(Integer, nullable=True)  # New column
    desconto = Column(Integer, nullable=True)  # New column
    criado_em = Column(TIMESTAMP, default=datetime.now)

    autor = relationship("User")
    tipo = relationship("Tipo")  # Relationship with Tipo table