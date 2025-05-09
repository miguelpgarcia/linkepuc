from sqlalchemy.orm import Session
from models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
