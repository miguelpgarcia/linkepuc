from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Optional
from models.mensagem import Mensagem
from models.user import User

def create_mensagem(db: Session, remetente_id: int, destinatario_id: int, conteudo: str) -> Mensagem:
    mensagem = Mensagem(
        remetente_id=remetente_id,
        destinatario_id=destinatario_id,
        conteudo=conteudo
    )
    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)
    return mensagem

def get_conversas(db: Session, user_id: int) -> list:
    # Group by (least, greatest) user IDs to uniquely identify a conversation
    subquery = db.query(
        func.least(Mensagem.remetente_id, Mensagem.destinatario_id).label('user1'),
        func.greatest(Mensagem.remetente_id, Mensagem.destinatario_id).label('user2'),
        func.max(Mensagem.criado_em).label('last_message_time')
    ).filter(
        or_(Mensagem.remetente_id == user_id, Mensagem.destinatario_id == user_id)
    ).group_by(
        func.least(Mensagem.remetente_id, Mensagem.destinatario_id),
        func.greatest(Mensagem.remetente_id, Mensagem.destinatario_id)
    ).subquery()

    # Join on both remetente_id and destinatario_id
    last_messages = db.query(
        Mensagem,
        User.id.label('usuario_id'),
        User.usuario.label('nome'),
        User.avatar,
        func.count(Mensagem.id).filter(
            (Mensagem.lida == False) & (Mensagem.destinatario_id == user_id)
        ).label('nao_lidas'),
        subquery.c.last_message_time
    ).join(
        subquery,
        and_(
            func.least(Mensagem.remetente_id, Mensagem.destinatario_id) == subquery.c.user1,
            func.greatest(Mensagem.remetente_id, Mensagem.destinatario_id) == subquery.c.user2,
            Mensagem.criado_em == subquery.c.last_message_time
        )
    ).join(
        User,
        # The other user in the conversation (not the current user)
        and_(
            User.id != user_id,
            or_(User.id == Mensagem.remetente_id, User.id == Mensagem.destinatario_id)
        )
    ).group_by(
        Mensagem.id,
        User.id,
        User.usuario,
        User.avatar,
        subquery.c.last_message_time
    ).order_by(desc(subquery.c.last_message_time)).all()

    return [
        {
            'id': msg[0].id,
            'usuario_id': msg[1],
            'nome': msg[2],
            'avatar': msg[3],
            'ultima_mensagem': msg[0].conteudo,
            'nao_lidas': msg[4],
            'ultima_atualizacao': msg[0].criado_em
        }
        for msg in last_messages
    ]

def get_mensagens(db: Session, user_id: int, other_user_id: int) -> List[Mensagem]:
    return db.query(Mensagem).filter(
        or_(
            and_(Mensagem.remetente_id == user_id, Mensagem.destinatario_id == other_user_id),
            and_(Mensagem.remetente_id == other_user_id, Mensagem.destinatario_id == user_id)
        )
    ).order_by(Mensagem.criado_em).all()

def marcar_como_lida(db: Session, user_id: int, other_user_id: int) -> None:
    db.query(Mensagem).filter(
        Mensagem.destinatario_id == user_id,
        Mensagem.remetente_id == other_user_id,
        Mensagem.lida == False
    ).update({Mensagem.lida: True})
    db.commit() 