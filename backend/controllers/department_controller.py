from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.department_repository import (
    get_departamento
)
from models.base import SessionLocal
from pydantic import BaseModel

departamento_router = APIRouter()

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
async def read_departamento_endpoint(db: Session = Depends(get_db)) -> list[DepartamentoGet]:
    return get_departamento(db)
