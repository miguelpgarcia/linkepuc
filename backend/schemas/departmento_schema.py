from pydantic import BaseModel

class DepartamentoResponse(BaseModel):
    id: int
    name: str


