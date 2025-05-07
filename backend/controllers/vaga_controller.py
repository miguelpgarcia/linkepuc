from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.vaga_repository import (
    create_vaga,
    get_vagas,
    get_vaga,
    update_vaga,
    delete_vaga,
)
from models.base import SessionLocal
from pydantic import BaseModel
from schemas.vaga_schema import VagaResponse
from typing import List

vaga_router = APIRouter()

class VagaCreate(BaseModel):
    titulo: str
    descricao: str
    prazo: str
    autor_id: int

class VagaUpdate(BaseModel):
    titulo: str
    descricao: str
    prazo: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@vaga_router.post("/")
async def create_vaga_endpoint(vaga: VagaCreate, db: Session = Depends(get_db)):
    return create_vaga(db, vaga.titulo, vaga.descricao, vaga.prazo, vaga.autor_id)

@vaga_router.get("/",response_model=List[VagaResponse])
async def read_vagas_endpoint(db: Session = Depends(get_db)):
    return get_vagas(db)

@vaga_router.get("/{id}")
async def read_vaga_endpoint(id: int, db: Session = Depends(get_db)):
    vaga = get_vaga(db, id)
    if not vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return vaga

@vaga_router.put("/{id}")
async def update_vaga_endpoint(id: int, vaga: VagaUpdate, db: Session = Depends(get_db)):
    updated = update_vaga(db, id, vaga.titulo, vaga.descricao, vaga.prazo)
    if not updated:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return updated

@vaga_router.delete("/{id}")
async def delete_vaga_endpoint(id: int, db: Session = Depends(get_db)):
    deleted = delete_vaga(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return {"message": "Vaga deleted successfully"}
