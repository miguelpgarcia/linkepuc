from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.department_repository import (
    get_departamento
)
from models.base import SessionLocal
from pydantic import BaseModel
from services.cache_service import static_cache

departamento_router = APIRouter()
from dependecies import get_current_user

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
async def read_departamento_endpoint():
    """Get departments - cached and public (no auth needed)"""
    print("Fetching departamentos (cached)")
    return static_cache.get_departments()
