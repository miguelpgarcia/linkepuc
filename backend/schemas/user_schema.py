# filepath: c:\Users\Miguel\Documents\tcc\linkepuc\backend\schemas\user_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    usuario: str
    email: str
    ehaluno: bool

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    usuario: Optional[str] = None
    email: Optional[str] = None
    ehaluno: Optional[bool] = None
    avatar: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    criado_em: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class AuthorResponse(BaseModel):
    id: int
    usuario: str
    ehaluno: bool
    avatar: str | None

    class Config:
        orm_mode = True  # Allows mapping from ORM models