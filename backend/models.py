from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, Text, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Interesses(Base):
    __tablename__ = "interesses"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)

class User(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)  # Add this field for hashed passwords
    ehaluno = Column(Boolean, nullable=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)

class Vagas(Base):
    __tablename__ = "vagas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, nullable=False)
    prazo = Column(Date, nullable=False)
    autor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    criado_em = Column(TIMESTAMP, default=datetime.now)

    autor = relationship("User")
