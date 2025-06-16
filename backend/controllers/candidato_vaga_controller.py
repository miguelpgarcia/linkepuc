from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from models.base import SessionLocal
from repositories.candidato_vaga_repository import (
    create_candidatura,
    get_candidaturas_by_vaga,
    get_candidaturas_by_candidato,
    get_candidatos_count,
    delete_candidatura
)
from models.vaga import Vagas


from dependecies import get_current_user

candidato_vaga_router = APIRouter(tags=["candidaturas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@candidato_vaga_router.post("/vaga/{vaga_id}/candidatar")
def candidatar_vaga(
    vaga_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.ehaluno:
        raise HTTPException(status_code=403, detail="Only students can apply for opportunities")
    
    candidatura = create_candidatura(db, current_user.id, vaga_id)
    return {"message": "Successfully applied for the opportunity"}

@candidato_vaga_router.get("/vaga/{vaga_id}/candidatos")
def get_candidatos_vaga(
    vaga_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only the author of the vaga can see the candidates
    vaga = db.query(Vagas).filter(Vagas.id == vaga_id).first()
    if not vaga or vaga.autor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view candidates")
    
    candidatos = get_candidaturas_by_vaga(db, vaga_id)
    return candidatos

@candidato_vaga_router.get("/vaga/{vaga_id}/candidatos/count")
def get_candidatos_count_endpoint(
    vaga_id: int,
    db: Session = Depends(get_db)
):
    count = get_candidatos_count(db, vaga_id)
    return {"count": count}

@candidato_vaga_router.delete("/vaga/{vaga_id}/candidatar")
def cancelar_candidatura(
    vaga_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.ehaluno:
        raise HTTPException(status_code=403, detail="Only students can cancel applications")
    
    candidatura = delete_candidatura(db, current_user.id, vaga_id)
    if not candidatura:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {"message": "Successfully cancelled application"} 