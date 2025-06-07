from sqlalchemy.orm import Session
from models.historico import Historico
from decimal import Decimal  # use Python's built-in Decimal

def create_historico(db: Session, user_id: int, historico_data: list[dict]):
    """
    Save the extracted historico data into the database.
    """
    
    for entry in historico_data:
        print(f"Processing entry: {entry}")  # Debugging line to check the data being processed
            

        historico = Historico(
            user_id=user_id,
            periodo=entry[0],
            codigo_disciplina=entry[1],
            nome_disciplina=entry[2],
            turma=entry[3],
            grau= Decimal(entry[4].replace(',', '.')) if entry[4] != '' else None,  # Convert to Decimal if not empty
            situacao=entry[5],
            n_creditos=int(entry[6]),
        )
        db.add(historico)
    db.commit()

def get_historico_by_user(db: Session, user_id: int):
    """
    Retrieve all historico entries for a specific user.
    """
    return db.query(Historico).filter(Historico.user_id == user_id).all()

def has_historico(db: Session, user_id: int):
    """
    Check if a user has any historico entries.
    """
    return db.query(Historico).filter(Historico.user_id == user_id).count() > 0


def delete_historico_by_user(db: Session, user_id: int):
    """
    Delete all historico entries for a specific user.
    """
    historico_entries = db.query(Historico).filter(Historico.user_id == user_id).all()
    for entry in historico_entries:
        db.delete(entry)
    db.commit()
    return historico_entries