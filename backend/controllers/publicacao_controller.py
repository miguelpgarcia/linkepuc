from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.publicacao_repository import (
    create_publicacao,
    get_publicacao,
    get_publicacoes,
    update_publicacao,
    delete_publicacao,
)
from models.base import SessionLocal
from pydantic import BaseModel
from dependecies import get_current_user_id


publicacao_router = APIRouter()

class PublicacaoCreate(BaseModel):
    author_id: int
    content: str

class PublicacaoUpdate(BaseModel):
    content: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@publicacao_router.post("/")
async def create_publicacao_endpoint(publicacao: PublicacaoCreate, db: Session = Depends(get_db)):
    return create_publicacao(db, publicacao.author_id, publicacao.content)

@publicacao_router.get("/")
async def read_publicacoes_endpoint(db: Session = Depends(get_db)):
    return get_publicacoes(db)

@publicacao_router.get("/{id}")
async def read_publicacao_endpoint(id: int, db: Session = Depends(get_db)):
    publicacao = get_publicacao(db, id)
    if not publicacao:
        raise HTTPException(status_code=404, detail="Publicacao not found")
    return publicacao

@publicacao_router.put("/{id}")
async def update_publicacao_endpoint(id: int, publicacao: PublicacaoUpdate, db: Session = Depends(get_db)):
    updated = update_publicacao(db, id, publicacao.content)
    if not updated:
        raise HTTPException(status_code=404, detail="Publicacao not found")
    return updated

@publicacao_router.delete("/{id}")
async def delete_publicacao_endpoint(id: int, db: Session = Depends(get_db)):
    deleted = delete_publicacao(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Publicacao not found")
    return {"message": "Publicacao deleted successfully"}
