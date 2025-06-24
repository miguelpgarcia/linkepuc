from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class CandidaturaCreate(BaseModel):
    carta_motivacao: Optional[str] = None

class CandidaturaResponse(BaseModel):
    id: int
    candidato_id: int
    vaga_id: int
    carta_motivacao: Optional[str] = None
    criado_em: str
    
    @field_validator('criado_em', mode='before')
    @classmethod
    def validate_criado_em(cls, v):
        if isinstance(v, datetime):
            return v.isoformat()
        return v
    
    class Config:
        from_attributes = True

class CandidatoInfo(BaseModel):
    id: int
    usuario: str
    email: Optional[str] = None
    avatar: Optional[str] = None
    
    class Config:
        from_attributes = True

class CandidaturaDetalhada(BaseModel):
    id: int
    candidato: CandidatoInfo
    carta_motivacao: Optional[str] = None
    criado_em: str
    
    @field_validator('criado_em', mode='before')
    @classmethod
    def validate_criado_em(cls, v):
        if isinstance(v, datetime):
            return v.isoformat()
        return v
    
    class Config:
        from_attributes = True 