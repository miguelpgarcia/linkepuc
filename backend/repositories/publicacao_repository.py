from sqlalchemy.orm import Session
from models.publicacao import Publicacao

def create_publicacao(db: Session, author_id: int, content: str):
    publicacao = Publicacao(author_id=author_id, content=content)
    db.add(publicacao)
    db.commit()
    db.refresh(publicacao)
    return publicacao

def get_publicacao(db: Session, publicacao_id: int):
    return db.query(Publicacao).filter(Publicacao.id == publicacao_id).first()

def get_publicacoes(db: Session):
    return db.query(Publicacao).all()

def update_publicacao(db: Session, publicacao_id: int, content: str):
    publicacao = db.query(Publicacao).filter(Publicacao.id == publicacao_id).first()
    if publicacao:
        publicacao.content = content
        db.commit()
        db.refresh(publicacao)
    return publicacao

def delete_publicacao(db: Session, publicacao_id: int):
    publicacao = db.query(Publicacao).filter(Publicacao.id == publicacao_id).first()
    if publicacao:
        db.delete(publicacao)
        db.commit()
    return publicacao
