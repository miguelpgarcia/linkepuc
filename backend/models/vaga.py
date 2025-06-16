from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base
from .user import User
from .tipo_vaga import Tipo  # Import the Tipo model
from .localizacao import Location  # Make sure this import is present

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
    location_id = Column(Integer, ForeignKey("location.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("department.id"), nullable=False)
    professor = Column(Text, nullable=True)  # Changed to nullable
    link_vaga = Column(Text, nullable=True)  # Changed to nullable
    status = Column(String, nullable=False, default="em_andamento")  # Status of the vaga itself

    autor = relationship("User")
    tipo = relationship("Tipo")  # Relationship with Tipo table
    interesses = relationship("InteresseVaga", back_populates="vaga")
    location = relationship("Location")
    department = relationship("Departamento")  # Add department relationship
    candidatos = relationship("CandidatoVaga", back_populates="vaga")  # Add relationship to candidatos
