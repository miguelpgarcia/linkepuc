from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from models.user import User
from models.base import SessionLocal
from repositories.candidato_vaga_repository import (
    create_candidatura,
    get_candidaturas_by_vaga,
    get_candidaturas_by_candidato,
    get_candidatos_count,
    delete_candidatura,
    check_candidatura_exists
)
from models.vaga import Vagas
from schemas.candidato_schema import CandidaturaCreate, CandidaturaResponse, CandidaturaDetalhada
from services.recommendation_service import RecommendationService
from typing import List

from dependecies import get_current_user

candidato_vaga_router = APIRouter(tags=["candidaturas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@candidato_vaga_router.post("/vaga/{vaga_id}/candidatar", response_model=CandidaturaResponse)
def candidatar_vaga(
    vaga_id: int,
    candidatura_data: CandidaturaCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.ehaluno:
        raise HTTPException(status_code=403, detail="Only students can apply for opportunities")
    
    candidatura = create_candidatura(db, current_user.id, vaga_id, candidatura_data.carta_motivacao)
    
    # Trigger recommendation refresh for popular_opportunities strategy after applying
    print(f"User {current_user.id} applied to vaga {vaga_id}, refreshing popular strategy")
    recommendation_service = RecommendationService()
    success = recommendation_service.calculate_strategy_recommendations(db, current_user.id, "popular")
    if success:
        print(f"Successfully updated popular recommendations for user {current_user.id}")
    else:
        print(f"Failed to update popular recommendations for user {current_user.id}")
    
    return candidatura

@candidato_vaga_router.get("/vaga/{vaga_id}/candidatos", response_model=List[CandidaturaDetalhada])
def get_candidatos_vaga(
    vaga_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only the author of the vaga can see the candidates
    vaga = db.query(Vagas).filter(Vagas.id == vaga_id).first()
    if not vaga or vaga.autor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view candidates")
    
    candidaturas = get_candidaturas_by_vaga(db, vaga_id)
    
    # Transform to detailed response
    result = []
    for candidatura in candidaturas:
        result.append({
            "id": candidatura.id,
            "candidato": {
                "id": candidatura.candidato.id,
                "usuario": candidatura.candidato.usuario,
                "email": candidatura.candidato.email,
                "avatar": candidatura.candidato.avatar
            },
            "carta_motivacao": candidatura.carta_motivacao,
            "criado_em": candidatura.criado_em.isoformat()
        })
    
    return result

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
    
    # Trigger recommendation refresh for popular_opportunities strategy after cancelling
    print(f"User {current_user.id} cancelled application to vaga {vaga_id}, refreshing popular strategy")
    recommendation_service = RecommendationService()
    success = recommendation_service.calculate_strategy_recommendations(db, current_user.id, "popular")
    if success:
        print(f"Successfully updated popular recommendations for user {current_user.id}")
    else:
        print(f"Failed to update popular recommendations for user {current_user.id}")
    
    return {"message": "Successfully cancelled application"} 

@candidato_vaga_router.get("/vaga/{vaga_id}/candidatura-status")
def get_candidatura_status(
    vaga_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.ehaluno:
        return {"has_applied": False}
    
    has_applied = check_candidatura_exists(db, current_user.id, vaga_id)
    return {"has_applied": has_applied} 