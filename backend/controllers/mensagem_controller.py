from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.user import User
from schemas.mensagem_schema import MensagemCreate, MensagemResponse, ConversaResponse
from repositories.mensagem_repository import create_mensagem, get_conversas, get_mensagens, marcar_como_lida
from dependecies import get_current_user
from models.base import SessionLocal

mensagem_router = APIRouter(tags=["mensagens"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@mensagem_router.post("", response_model=MensagemResponse)
def create_mensagem_endpoint(
    mensagem: MensagemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_mensagem(db, current_user.id, mensagem.destinatario_id, mensagem.conteudo)

@mensagem_router.get("/conversas", response_model=List[ConversaResponse])
def get_conversas_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_conversas(db, current_user.id)

@mensagem_router.get("/conversa/{other_user_id}", response_model=List[MensagemResponse])
def get_mensagens_endpoint(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mark messages as read when retrieving them
    marcar_como_lida(db, current_user.id, other_user_id)
    return get_mensagens(db, current_user.id, other_user_id) 