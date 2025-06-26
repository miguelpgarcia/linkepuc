from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from repositories.interesse_repository import (
    create_interesse,
    get_interesses,
    get_interesse,
    update_interesse,
    delete_interesse,
    add_user_interests,
    update_user_interests,
)
from models.base import SessionLocal
from pydantic import BaseModel
from dependecies import get_current_user
from services.cache_service import static_cache
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
    # Check if interest already exists
    from models.interesse import Interesses
    existing = db.query(Interesses).filter(Interesses.nome == interesse.nome).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Interesse '{interesse.nome}' já existe"
        )
    
    return create_interesse(db, interesse.nome)

@interesse_router.get("/")
async def read_interesses_endpoint():
    """Get interests - cached and public (no auth needed)"""
    print("Fetching interesses (cached)")
    return static_cache.get_interests()

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

@interesse_router.put("/usuario/{usuario_id}")
async def update_user_interests_endpoint(
    usuario_id: int, 
    request: List[str], 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Only allow users to update their own interests
    if usuario_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode atualizar seus próprios interesses"
        )
    
    try:
        update_user_interests(db, usuario_id, request)
        return {"message": "Interesses atualizados com sucesso"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
