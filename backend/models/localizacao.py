from sqlalchemy import Column, Integer, String
from .base import Base

class Location(Base):
    __tablename__ = "location"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)