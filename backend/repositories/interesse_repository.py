from sqlalchemy.orm import Session
from models.interesse_usuario import InteresseUsuario
from models.interesse import Interesses
from models.user import User

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

def add_user_interests(db: Session, usuario_id: int, interesses: list[str]):
    """Add interests to a user."""
    # First, get or create the interests
    for interesse_nome in interesses:
        # Check if interest exists
        interesse = db.query(Interesses).filter(Interesses.nome == interesse_nome).first()
        
        if not interesse:
            # Create new interest if it doesn't exist
            interesse = Interesses(nome=interesse_nome)
            db.add(interesse)
            db.flush()  # Flush to get the ID
        
        # Check if user-interest relationship already exists
        existing = db.query(InteresseUsuario).filter(
            InteresseUsuario.usuario_id == usuario_id,
            InteresseUsuario.interesse_id == interesse.id
        ).first()
        
        if not existing:
            # Create new user-interest relationship
            user_interest = InteresseUsuario(
                usuario_id=usuario_id,
                interesse_id=interesse.id
            )
            db.add(user_interest)
    
    db.commit()
