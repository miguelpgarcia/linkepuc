from sqlalchemy import Column, Integer, String

from .base import Base

class Disciplina(Base):
    __tablename__ = "disciplinas"  # Use lowercase if the table is created without quotes
    id = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    nome = Column(String(255), nullable=False)
    professor = Column(String(255))
    horario = Column(String(255))
    departamento = Column(String(50))
    creditos = Column(Integer)
    horas_a_distancia = Column(Integer)
    shf = Column(Integer)
    periodo = Column(String(50))

    def __repr__(self):
        return f"<Disciplina(codigo='{self.codigo}', nome='{self.nome}')>"
