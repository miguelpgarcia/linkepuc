from pydantic import BaseModel

class HistoricoBase(BaseModel):
    periodo: str
    codigo_disciplina: str
    nome_disciplina: str
    turma: str | None
    grau: str | None
    situacao: str | None
    n_creditos: str | None

    class Config:
        orm_mode = True

class HistoricoCreate(HistoricoBase):
    pass

class HistoricoResponse(HistoricoBase):
    id: int
    user_id: int