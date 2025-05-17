from sqlalchemy.orm import Session
from models.vaga import Vagas
from sqlalchemy.orm import joinedload
from models.interesse_vaga import InteresseVaga


def create_vaga(db: Session, titulo: str, descricao: str, prazo: str, autor_id: int, interesses: list[int], location_id: int, department_id: int, remuneracao: int, horas_complementares: int, desconto: int, tipo_id: int):
    print("Aqui")
    vaga = Vagas(titulo=titulo, descricao=descricao, prazo=prazo, autor_id=autor_id, location_id=location_id, department_id=department_id, remuneracao=remuneracao, horas_complementares=horas_complementares, desconto=desconto, tipo_id=tipo_id)
    db.add(vaga)
    db.commit()
    db.refresh(vaga)

    # Associate interesses with the vaga
    for interesse_id in interesses:
        interesse_vaga = InteresseVaga(interesse_id=interesse_id, vaga_id=vaga.id)
        db.add(interesse_vaga)
    db.commit()

    return vaga

def get_vaga(db: Session, vaga_id: int):
    return db.query(Vagas).filter(Vagas.id == vaga_id).first()

def get_vagas(db: Session):
    return db.query(Vagas).options(joinedload(Vagas.autor), joinedload(Vagas.tipo)).all()

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

def get_tipos_vaga(db: Session):
    from models.tipo_vaga import Tipo
    return db.query(Tipo).all()
