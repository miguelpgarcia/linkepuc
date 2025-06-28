from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from repositories.vaga_repository import (
    create_vaga,
    get_vagas,
    get_vaga,
    update_vaga,
    update_vaga_status,
    delete_vaga,
    get_tipos_vaga,
    get_vagas_by_professor,
    get_vagas_cached,
)
from services.cache_service import static_cache
from models.base import SessionLocal
from pydantic import BaseModel
from schemas.vaga_schema import VagaResponse
from typing import List, Optional
from dependecies import get_current_user
from models.user import User


vaga_router = APIRouter()

class VagaCreate(BaseModel):
    titulo: str
    descricao: str
    prazo: str
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
    interesses: list[int]  # Add interests to the update model

class VagaStatusUpdate(BaseModel):
    status: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@vaga_router.post("/")
async def create_vaga_endpoint(vaga: VagaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("Creating vaga")
    return create_vaga(db, vaga.titulo, vaga.descricao, vaga.prazo, current_user.id, vaga.interesses, vaga.location_id, vaga.department_id, vaga.remuneracao, vaga.horas_complementares, vaga.desconto, vaga.tipo_id)

@vaga_router.get("/")
async def read_vagas_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    tipos: Optional[str] = Query(None, description="Comma-separated list of tipo IDs"),
    departamento: Optional[str] = Query(None, description="Department name"),
    beneficios: Optional[str] = Query(None, description="Comma-separated list of benefits"),
    busca: Optional[str] = Query(None, description="Search query for title/description")
):
    # Parse filter parameters
    tipo_ids = []
    if tipos:
        try:
            tipo_ids = [int(t.strip()) for t in tipos.split(',') if t.strip()]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid tipo IDs format")
    
    benefit_list = []
    if beneficios:
        benefit_list = [b.strip() for b in beneficios.split(',') if b.strip()]
    
    # Debug logs
    print(f"=== CONTROLLER DEBUG ===")
    print(f"Raw tipos param: {tipos}")
    print(f"Parsed tipo_ids: {tipo_ids}")
    print(f"Raw beneficios param: {beneficios}")
    print(f"Parsed benefit_list: {benefit_list}")
    print(f"departamento: {departamento}")
    print(f"busca: {busca}")
    print(f"=== END CONTROLLER DEBUG ===")
    
    
    # Pass filters to repository
    result = get_vagas(
        db, 
        skip=skip, 
        limit=limit, 
        user_id=current_user.id,
        tipo_ids=tipo_ids,
        departamento=departamento,
        beneficios=benefit_list,
        busca=busca
    )
    return {
        "vagas": result["vagas"],
        "total": result["total"],
        "recommended_count": result["recommended_count"],
        "skip": skip,
        "limit": limit
    }

@vaga_router.get("/new")
async def get_new_vaga_data():
    return {"message": "This endpoint is for fetching data to create a new vaga. Send a POST request to /vagas/ to create one."}

@vaga_router.get("/tipo")
async def get_vagas_by_tipo():
    """Get opportunity types - cached and public (no auth needed)"""
    print("Fetching tipos (cached)")
    tipos = static_cache.get_opportunity_types()
    if not tipos:
        raise HTTPException(status_code=404, detail="No opportunity types found")
    return tipos

@vaga_router.get("/professor", response_model=List[VagaResponse])
async def read_professor_vagas_endpoint(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("=== Debug: Professor Vagas Endpoint ===")
    print(f"Request received for /professor endpoint")
    print(f"User ID: {current_user.id}")
    print("=== End Debug ===")
    return get_vagas_by_professor(db, current_user.id)

@vaga_router.get("/{id}", response_model=VagaResponse)
async def read_vaga_endpoint(id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    vaga = get_vaga(db, id)
    if not vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return vaga

@vaga_router.put("/{id}")
async def update_vaga_endpoint(id: int, vaga: VagaUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if the vaga exists and belongs to the current user
    existing_vaga = get_vaga(db, id)
    if not existing_vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    
    if existing_vaga.autor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this vaga")
    
    # Update the vaga
    updated = update_vaga(db, id, vaga.titulo, vaga.descricao, vaga.prazo, vaga.interesses)
    if not updated:
        raise HTTPException(status_code=404, detail="Failed to update vaga")
    return updated

@vaga_router.put("/{id}/status")
async def update_vaga_status_endpoint(id: int, status_update: VagaStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # First check if the vaga exists and belongs to the current user
    vaga = get_vaga(db, id)
    if not vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    
    if vaga.autor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this vaga")
    
    # Validate status values
    valid_statuses = ["aguardando", "em_analise", "finalizada", "encerrada", "em_andamento"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    updated = update_vaga_status(db, id, status_update.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Failed to update vaga status")
    return {"message": "Vaga status updated successfully", "new_status": status_update.status}

@vaga_router.delete("/{id}")
async def delete_vaga_endpoint(id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    deleted = delete_vaga(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return {"message": "Vaga deleted successfully"}