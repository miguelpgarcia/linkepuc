# filepath: c:\Users\Miguel\Documents\tcc\linkepuc\backend\schemas\vaga_schema.py
from pydantic import BaseModel
from datetime import date, datetime
from .user_schema import AuthorResponse
from .tipo_schema import TipoResponse  # Assuming you have a TipoResponse schema
from .departmento_schema import DepartamentoResponse
from typing import List

class InteresseResponse(BaseModel):
    id: int
    nome: str

    class Config:
        orm_mode = True

class InteresseVagaResponse(BaseModel):
    interesse: InteresseResponse

    class Config:
        orm_mode = True

class VagaResponse(BaseModel):
    id: int
    titulo: str
    descricao: str
    prazo: date
    tipo: TipoResponse | None  # Nested schema for tipo
    remuneracao: int | None
    horas_complementares: int | None
    desconto: int | None
    criado_em: datetime
    autor: AuthorResponse  # Nested schema for the author
    department: DepartamentoResponse | None  # Changed to use DepartamentoResponse
    link_vaga: str | None  # Added link_vaga field
    professor: str | None  # Added professor field
    status: str = "aguardando"  # Default status
    candidates: int = 0  # Default number of candidates
    interesses: List[InteresseVagaResponse] = []  # Changed to use InteresseVagaResponse

    class Config:
        orm_mode = True  # Allows mapping from ORM models