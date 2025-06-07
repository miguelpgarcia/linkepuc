from .base import Base

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Departamento(Base):
    __tablename__ = "department"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    sigla = Column(String(50), nullable=False)



    def __repr__(self):
        return f"<Departamento(nome='{self.nome}', sigla='{self.sigla}')>"