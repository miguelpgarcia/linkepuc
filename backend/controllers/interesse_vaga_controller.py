from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.interesse_vaga_repository import (
    get_interesses_by_vaga,
    get_vagas_by_interesse,
    create_interesse_vaga,
    delete_interesse_vaga,
)
from models.base import SessionLocal
from pydantic import BaseModel
from dependecies import get_current_user


interesse_vaga_router = APIRouter()

class InteresseVagaCreate(BaseModel):
    interesse_id: int
    vaga_id: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@interesse_vaga_router.get("/vaga/{vaga_id}")
async def get_interesses_for_vaga(vaga_id: int, db: Session = Depends(get_db)):
    interesses = get_interesses_by_vaga(db, vaga_id)
    if not interesses:
        raise HTTPException(status_code=404, detail="No interesses found for this vaga")
    return interesses

@interesse_vaga_router.get("/interesse/{interesse_id}")
async def get_vagas_for_interesse(interesse_id: int, db: Session = Depends(get_db)):
    vagas = get_vagas_by_interesse(db, interesse_id)
    if not vagas:
        raise HTTPException(status_code=404, detail="No vagas found for this interesse")
    return vagas

@interesse_vaga_router.post("/")
async def create_interesse_vaga_relation(data: InteresseVagaCreate, db: Session = Depends(get_db)):
    return create_interesse_vaga(db, data.interesse_id, data.vaga_id)

@interesse_vaga_router.delete("/{id}")
async def delete_interesse_vaga_relation(id: int, db: Session = Depends(get_db)):
    deleted = delete_interesse_vaga(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Relation not found")
    return {"message": "Relation deleted successfully"}