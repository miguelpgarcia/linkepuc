from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MensagemBase(BaseModel):
    conteudo: str

class MensagemCreate(MensagemBase):
    destinatario_id: int

class MensagemResponse(MensagemBase):
    id: int
    remetente_id: int
    destinatario_id: int
    lida: bool
    criado_em: datetime

    class Config:
        from_attributes = True

class ConversaResponse(BaseModel):
    id: int
    usuario_id: int
    nome: str
    avatar: Optional[str]
    ultima_mensagem: Optional[str]
    nao_lidas: int
    ultima_atualizacao: datetime

    class Config:
        from_attributes = True 