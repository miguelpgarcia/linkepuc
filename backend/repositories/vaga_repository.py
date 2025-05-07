from sqlalchemy.orm import Session
from models.vaga import Vagas
from sqlalchemy.orm import joinedload


def create_vaga(db: Session, titulo: str, descricao: str, prazo: str, autor_id: int):
    vaga = Vagas(titulo=titulo, descricao=descricao, prazo=prazo, autor_id=autor_id)
    db.add(vaga)
    db.commit()
    db.refresh(vaga)
    return vaga

def get_vaga(db: Session, vaga_id: int):
    return db.query(Vagas).filter(Vagas.id == vaga_id).first()

def get_vagas(db: Session):
    return db.query(Vagas).options(joinedload(Vagas.autor), joinedload(Vagas.tipo)).all()

def update_vaga(db: Session, vaga_id: int, titulo: str, descricao: str, prazo: str):
    vaga = db.query(Vagas).filter(Vagas.id == vaga_id).first()
    if vaga:
        vaga.titulo = titulo
        vaga.descricao = descricao
        vaga.prazo = prazo
        db.commit()
        db.refresh(vaga)
    return vaga

def delete_vaga(db: Session, vaga_id: int):
    vaga = db.query(Vagas).filter(Vagas.id == vaga_id).first()
    if vaga:
        db.delete(vaga)
        db.commit()
    return vaga
