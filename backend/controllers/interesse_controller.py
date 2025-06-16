from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from repositories.interesse_repository import (
    create_interesse,
    get_interesses,
    get_interesse,
    update_interesse,
    delete_interesse,
    add_user_interests,
)
from models.base import SessionLocal
from pydantic import BaseModel
from dependecies import get_current_user
from typing import List


interesse_router = APIRouter()

class InteresseCreate(BaseModel):
    nome: str

class InteresseUpdate(BaseModel):
    nome: str

class UserInterestsRequest(BaseModel):
    usuario_id: int
    interesses: List[str]

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
async def read_interesses_endpoint(db: Session = Depends(get_db)):
    return get_interesses(db)

@interesse_router.get("/{id}")
async def read_interesse_endpoint(id: int, db: Session = Depends(get_db)):
    interesse = get_interesse(db, id)
    if not interesse:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return interesse

@interesse_router.put("/{id}")
async def update_interesse_endpoint(id: int, interesse: InteresseUpdate, db: Session = Depends(get_db),user_id: int = Depends(get_current_user)):
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

@interesse_router.post("/usuario")
async def add_interests_endpoint(request: UserInterestsRequest, db: Session = Depends(get_db)):
    try:
        add_user_interests(db, request.usuario_id, request.interesses)
        return {"message": "Interesses adicionados com sucesso"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
