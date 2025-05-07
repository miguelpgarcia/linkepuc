from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Publicacao(Base):
    __tablename__ = "publicacoes"
    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    content = Column(Text, nullable=False)
    published_at = Column(TIMESTAMP, default=datetime.now)

    author = relationship("User")
