from pydantic import BaseModel

class TipoResponse(BaseModel):
    id: int
    nome: str

    class Config:
        orm_mode = True  # Allows mapping from ORM models