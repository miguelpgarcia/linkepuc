from sqlalchemy.orm import Session
from models import Interesses, User, Vagas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

def create_user(db: Session, usuario: str, password: str, ehaluno: bool):
    hashed_password = pwd_context.hash(password)
    user = User(usuario=usuario, password=hashed_password, ehaluno=ehaluno)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session):
    return db.query(User).all()

def update_user(db: Session, user_id: int, usuario: str, ehaluno: bool):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.usuario = usuario
        user.ehaluno = ehaluno
        db.commit()
        db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user

def create_vaga(db: Session, titulo: str, descricao: str, prazo: str, autor_id: int):
    vaga = Vagas(titulo=titulo, descricao=descricao, prazo=prazo, autor_id=autor_id)
    db.add(vaga)
    db.commit()
    db.refresh(vaga)
    return vaga

def get_vaga(db: Session, vaga_id: int):
    return db.query(Vagas).filter(Vagas.id == vaga_id).first()

def get_vagas(db: Session):
    return db.query(Vagas).all()

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
