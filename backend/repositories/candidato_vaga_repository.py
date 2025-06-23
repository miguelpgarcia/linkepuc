from sqlalchemy.orm import Session, joinedload
from models.candidato_vaga import CandidatoVaga
from models.user import User
from sqlalchemy import func

def create_candidatura(db: Session, candidato_id: int, vaga_id: int, carta_motivacao: str = None):
    # Check if candidatura already exists
    existing = db.query(CandidatoVaga).filter(
        CandidatoVaga.candidato_id == candidato_id,
        CandidatoVaga.vaga_id == vaga_id
    ).first()
    
    if existing:
        return existing
    
    # Create new candidatura
    candidatura = CandidatoVaga(
        candidato_id=candidato_id,
        vaga_id=vaga_id,
        carta_motivacao=carta_motivacao
    )
    db.add(candidatura)
    db.commit()
    db.refresh(candidatura)
    return candidatura

def get_candidaturas_by_vaga(db: Session, vaga_id: int):
    return db.query(CandidatoVaga).options(joinedload(CandidatoVaga.candidato)).filter(CandidatoVaga.vaga_id == vaga_id).all()

def get_candidaturas_by_candidato(db: Session, candidato_id: int):
    return db.query(CandidatoVaga).filter(CandidatoVaga.candidato_id == candidato_id).all()

def get_candidatos_count(db: Session, vaga_id: int):
    return db.query(func.count(CandidatoVaga.id)).filter(CandidatoVaga.vaga_id == vaga_id).scalar()

def delete_candidatura(db: Session, candidato_id: int, vaga_id: int):
    candidatura = db.query(CandidatoVaga).filter(
        CandidatoVaga.candidato_id == candidato_id,
        CandidatoVaga.vaga_id == vaga_id
    ).first()
    
    if candidatura:
        db.delete(candidatura)
        db.commit()
    return candidatura 

def check_candidatura_exists(db: Session, candidato_id: int, vaga_id: int):
    return db.query(CandidatoVaga).filter(
        CandidatoVaga.candidato_id == candidato_id,
        CandidatoVaga.vaga_id == vaga_id
    ).first() is not None 