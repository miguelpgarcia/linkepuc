from sqlalchemy.orm import Session
from models.interesse_usuario import InteresseUsuario

def get_interesses_by_user(db: Session, usuario_id: int):
    return db.query(InteresseUsuario).filter(InteresseUsuario.usuario_id == usuario_id).all()

def create_interesse_usuario(db: Session, interesse_id: int, usuario_id: int):
    interesse_usuario = InteresseUsuario(interesse_id=interesse_id, usuario_id=usuario_id)
    db.add(interesse_usuario)
    db.commit()
    db.refresh(interesse_usuario)
    return interesse_usuario

def delete_interesse_usuario(db: Session, interesse_usuario_id: int):
    interesse_usuario = db.query(InteresseUsuario).filter(InteresseUsuario.id == interesse_usuario_id).first()
    if interesse_usuario:
        db.delete(interesse_usuario)
        db.commit()
    return interesse_usuario
