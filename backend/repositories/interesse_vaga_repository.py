from sqlalchemy.orm import Session
from models.interesse_vaga import InteresseVaga

def get_interesses_by_vaga(db: Session, vaga_id: int):
    return db.query(InteresseVaga).filter(InteresseVaga.vaga_id == vaga_id).all()

def get_vagas_by_interesse(db: Session, interesse_id: int):
    return db.query(InteresseVaga).filter(InteresseVaga.interesse_id == interesse_id).all()

def create_interesse_vaga(db: Session, interesse_id: int, vaga_id: int):
    interesse_vaga = InteresseVaga(interesse_id=interesse_id, vaga_id=vaga_id)
    db.add(interesse_vaga)
    db.commit()
    db.refresh(interesse_vaga)
    return interesse_vaga

def delete_interesse_vaga(db: Session, interesse_vaga_id: int):
    interesse_vaga = db.query(InteresseVaga).filter(InteresseVaga.id == interesse_vaga_id).first()
    if interesse_vaga:
        db.delete(interesse_vaga)
        db.commit()
    return interesse_vaga