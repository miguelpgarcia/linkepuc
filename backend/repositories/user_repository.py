from sqlalchemy.orm import Session, joinedload
from models.user import User
from models.interesse_usuario import InteresseUsuario
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_user(
    db: Session, 
    usuario: str, 
    password: str, 
    ehaluno: bool, 
    email: str,
    verification_token: str = None,
    token_expires: datetime = None
):
    hashed_password = get_password_hash(password)
    db_user = User(
        usuario=usuario,
        password=hashed_password,
        ehaluno=ehaluno,
        email=email,
        verification_token=verification_token,
        verification_token_expires=token_expires,
        email_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_verification_token(db: Session, token: str):
    return db.query(User).filter(User.verification_token == token).first()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_with_interests(db: Session, user_id: int):
    """Get user with their interests loaded"""
    return db.query(User).options(
        joinedload(User.interesses).joinedload(InteresseUsuario.interesse)
    ).filter(User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, usuario: str, ehaluno: bool, sobre: str = None):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.usuario = usuario
        db_user.ehaluno = ehaluno
        if sobre is not None:
            db_user.sobre = sobre
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.usuario == username).first()

def update_user_password(db: Session, user_id: int, new_password: str):
    """Update user password with hashing"""
    db_user = get_user(db, user_id)
    if db_user:
        db_user.password = get_password_hash(new_password)
        db.commit()
        db.refresh(db_user)
    return db_user
