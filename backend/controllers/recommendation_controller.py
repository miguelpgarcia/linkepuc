from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from pydantic import BaseModel
from models.base import SessionLocal
from dependecies import get_current_user
from services.recommendation_service import RecommendationService

recommendation_router = APIRouter()

class RecommendationResponse(BaseModel):
    vaga_id: int
    vaga: Dict
    total_score: float
    strategies: List[Dict]
    updated_at: Optional[str]

class RecommendationExplanationResponse(BaseModel):
    vaga_id: int
    user_id: int
    total_score: float
    strategies: List[Dict]

class RecommendationStatsResponse(BaseModel):
    total_active_recommendations: int
    users_with_recommendations: int
    average_recommendations_per_user: float

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize recommendation service
recommendation_service = RecommendationService()

@recommendation_router.get("/", response_model=List[RecommendationResponse])
async def get_user_recommendations(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get personalized recommendations for the current user"""
    
    # Only students can get recommendations
    if not current_user.ehaluno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas estudantes podem receber recomendações"
        )
    
    try:
        # Just get existing recommendations (no refresh to keep it fast)
        recommendations = recommendation_service.get_user_recommendations(
            db, current_user.id, limit
        )
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar recomendações: {str(e)}"
        )

@recommendation_router.get("/explanation/{vaga_id}", response_model=RecommendationExplanationResponse)
async def get_recommendation_explanation(
    vaga_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get detailed explanation for why a specific opportunity was recommended"""
    
    if not current_user.ehaluno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas estudantes podem ver explicações de recomendações"
        )
    
    try:
        explanation = recommendation_service.get_recommendation_explanation(
            db, current_user.id, vaga_id
        )
        
        if not explanation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Explicação de recomendação não encontrada"
            )
        
        return explanation
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar explicação: {str(e)}"
        )

@recommendation_router.post("/refresh")
async def refresh_user_recommendations(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Manually refresh recommendations for the current user"""
    
    if not current_user.ehaluno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas estudantes podem atualizar recomendações"
        )
    
    try:
        # Run recommendation calculation in background
        print(f"current_user.id: {current_user.id}")
        recommendation_service.calculate_and_store_recommendations(db, current_user.id)
        
        return {"message": "Recomendações estão sendo atualizadas em segundo plano"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao atualizar recomendações: {str(e)}"
        )

@recommendation_router.get("/stats", response_model=RecommendationStatsResponse)
async def get_recommendation_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get recommendation system statistics (admin only)"""
    
    # Only professors/admins can see stats
    if current_user.ehaluno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas professores podem ver estatísticas do sistema"
        )
    
    try:
        stats = recommendation_service.get_recommendation_stats(db)
        return stats
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar estatísticas: {str(e)}"
        )

@recommendation_router.post("/calculate-all")
async def calculate_recommendations_for_all_users(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Calculate recommendations for all users (admin only)"""
    
    # Only professors/admins can trigger bulk calculations
    if current_user.ehaluno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas professores podem calcular recomendações em massa"
        )
    
    try:
        # Run bulk calculation in background
        background_tasks.add_task(
            recommendation_service.calculate_recommendations_for_all_users,
            db
        )
        
        return {"message": "Cálculo de recomendações para todos os usuários iniciado em segundo plano"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao iniciar cálculo em massa: {str(e)}"
        )

@recommendation_router.delete("/vaga/{vaga_id}")
async def invalidate_recommendations_for_vaga(
    vaga_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Invalidate all recommendations for a specific opportunity"""
    
    # Only professors can invalidate recommendations
    if current_user.ehaluno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas professores podem invalidar recomendações"
        )
    
    try:
        recommendation_service.invalidate_recommendations_for_vaga(db, vaga_id)
        return {"message": f"Recomendações para a vaga {vaga_id} foram invalidadas"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao invalidar recomendações: {str(e)}"
        ) 