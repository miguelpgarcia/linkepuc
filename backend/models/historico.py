from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from .base import Base

class Historico(Base):
    __tablename__ = "historicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)  # Associate with User
    periodo = Column(String, nullable=False)
    codigo_disciplina = Column(String, nullable=False)
    nome_disciplina = Column(String, nullable=False)
    turma = Column(String, nullable=True)
    grau = Column(Numeric, nullable=True)
    situacao = Column(String, nullable=True)
    n_creditos = Column(Integer, nullable=True)

    user = relationship("User", back_populates="historicos")  # Relationship with User