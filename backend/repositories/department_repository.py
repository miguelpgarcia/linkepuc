from sqlalchemy.orm import Session
from models.departamento import Departamento


def get_departamento(db: Session):
    return db.query(Departamento).all()
