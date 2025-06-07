from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.vaga_repository import (
    create_vaga,
    get_vagas,
    get_vaga,
    update_vaga,
    delete_vaga,
    get_tipos_vaga,
)
from models.base import SessionLocal
from pydantic import BaseModel
from schemas.vaga_schema import VagaResponse
from typing import List
from dependecies import get_current_user_id


vaga_router = APIRouter()

class VagaCreate(BaseModel):
    titulo: str
    descricao: str
    prazo: str
    autor_id: int
    interesses: list[int]  # New field for a list of interesse IDs
    location_id: int
    department_id: int
    remuneracao: int
    horas_complementares: int
    desconto: int
    tipo_id: int


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
async def create_vaga_endpoint(vaga: VagaCreate, db: Session = Depends(get_db),user_id: int = Depends(get_current_user_id)):
    print("Creating vaga")
    return create_vaga(db, vaga.titulo, vaga.descricao, vaga.prazo, vaga.autor_id, vaga.interesses, vaga.location_id, vaga.department_id, vaga.remuneracao, vaga.horas_complementares, vaga.desconto, vaga.tipo_id)

@vaga_router.get("/",response_model=List[VagaResponse])
async def read_vagas_endpoint(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    print("Fetching vagas")
    print(user_id)
    return get_vagas(db)

@vaga_router.get("/tipo")
async def get_vagas_by_tipo(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    print("Fetching tipos")
    tipos = get_tipos_vaga(db)
    if not tipos:
        raise HTTPException(status_code=404, detail="No vagas found for this tipo")
    return tipos

@vaga_router.get("/{id}", response_model=VagaResponse)
async def read_vaga_endpoint(id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    vaga = get_vaga(db, id)
    if not vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return vaga

@vaga_router.put("/{id}")
async def update_vaga_endpoint(id: int, vaga: VagaUpdate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    updated = update_vaga(db, id, vaga.titulo, vaga.descricao, vaga.prazo)
    if not updated:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return updated

@vaga_router.delete("/{id}")
async def delete_vaga_endpoint(id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    deleted = delete_vaga(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return {"message": "Vaga deleted successfully"}