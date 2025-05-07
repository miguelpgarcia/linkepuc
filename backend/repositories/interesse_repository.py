from sqlalchemy.orm import Session
from models.interesse import Interesses

def create_interesse(db: Session, nome: str):
    interesse = Interesses(nome=nome)
    db.add(interesse)
    db.commit()
    db.refresh(interesse)
    return interesse

def get_interesse(db: Session, interesse_id: int):
    return db.query(Interesses).filter(Interesses.id == interesse_id).first()

def get_interesses(db: Session):
    return db.query(Interesses).all()

def update_interesse(db: Session, interesse_id: int, nome: str):
    interesse = db.query(Interesses).filter(Interesses.id == interesse_id).first()
    if interesse:
        interesse.nome = nome
        db.commit()
        db.refresh(interesse)
    return interesse

def delete_interesse(db: Session, interesse_id: int):
    interesse = db.query(Interesses).filter(Interesses.id == interesse_id).first()
    if interesse:
        db.delete(interesse)
        db.commit()
    return interesse
