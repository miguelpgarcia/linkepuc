from sqlalchemy.orm import Session
from models.departamento import Departamento


def get_departamento(db: Session):
    return db.query(Departamento).all()

def get_department_id_by_name(db: Session, name: str):
    return db.query(Departamento).filter(Departamento.name == name).first()
