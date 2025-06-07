from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.interesse_usuario_repository import (
    get_interesses_by_user,
    create_interesse_usuario,
    delete_interesse_usuario,
)
from models.base import SessionLocal
from pydantic import BaseModel
from dependecies import get_current_user_id



interesse_usuario_router = APIRouter()

class InteresseUsuarioCreate(BaseModel):
    interesse_id: int
    usuario_id: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@interesse_usuario_router.get("/user/{usuario_id}")
async def get_interesses_for_user(usuario_id: int, db: Session = Depends(get_db)):
    interesses = get_interesses_by_user(db, usuario_id)
    if not interesses:
        raise HTTPException(status_code=404, detail="No interesses found for this user")
    return interesses

@interesse_usuario_router.post("/")
async def create_interesse_usuario_relation(data: InteresseUsuarioCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return create_interesse_usuario(db, data.interesse_id, data.usuario_id)

@interesse_usuario_router.delete("/{id}")
async def delete_interesse_usuario_relation(id: int, db: Session = Depends(get_db)):
    deleted = delete_interesse_usuario(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Relation not found")
    return {"message": "Relation deleted successfully"}
