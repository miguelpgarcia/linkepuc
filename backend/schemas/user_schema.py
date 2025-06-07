# filepath: c:\Users\Miguel\Documents\tcc\linkepuc\backend\schemas\user_schema.py
from pydantic import BaseModel

class AuthorResponse(BaseModel):
    id: int
    usuario: str
    ehaluno: bool
    avatar: str | None

    class Config:
        orm_mode = True  # Allows mapping from ORM models