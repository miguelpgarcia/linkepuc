from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.department_repository import (
    get_departamento
)
from models.base import SessionLocal
from pydantic import BaseModel

departamento_router = APIRouter()
from dependecies import get_current_user_id

class DepartamentoGet(BaseModel):
    id: int
    name: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@departamento_router.get("/")
async def read_departamento_endpoint(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)) -> list[DepartamentoGet]:
    user_id = user_id if user_id else 1  # Default to 1 if no user_id is provided
    print(user_id)
    return get_departamento(db)
