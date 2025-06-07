from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.interesse_repository import (
    create_interesse,
    get_interesses,
    get_interesse,
    update_interesse,
    delete_interesse,
)
from models.base import SessionLocal
from pydantic import BaseModel
from dependecies import get_current_user_id


interesse_router = APIRouter()

class InteresseCreate(BaseModel):
    nome: str

class InteresseUpdate(BaseModel):
    nome: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@interesse_router.post("/")
async def create_interesse_endpoint(interesse: InteresseCreate, db: Session = Depends(get_db)):
    return create_interesse(db, interesse.nome)

@interesse_router.get("/")
async def read_interesses_endpoint(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return get_interesses(db)

@interesse_router.get("/{id}")
async def read_interesse_endpoint(id: int, db: Session = Depends(get_db)):
    interesse = get_interesse(db, id)
    if not interesse:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return interesse

@interesse_router.put("/{id}")
async def update_interesse_endpoint(id: int, interesse: InteresseUpdate, db: Session = Depends(get_db),user_id: int = Depends(get_current_user_id)):
    updated = update_interesse(db, id, interesse.nome)
    if not updated:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return updated

@interesse_router.delete("/{id}")
async def delete_interesse_endpoint(id: int, db: Session = Depends(get_db)):
    deleted = delete_interesse(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return {"message": "Interesse deleted successfully"}
