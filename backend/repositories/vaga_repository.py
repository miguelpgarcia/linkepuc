from sqlalchemy.orm import Session
from models.vaga import Vagas
from sqlalchemy.orm import joinedload
from models.interesse_vaga import InteresseVaga
from sqlalchemy import func
from models.candidato_vaga import CandidatoVaga



def create_vaga(db: Session, titulo: str, descricao: str, prazo: str, autor_id: int, interesses: list[int], location_id: int, department_id: int, remuneracao: int, horas_complementares: int, desconto: int, tipo_id: int, link_vaga: str = None, professor: str = None):
    print("Aqui")
    has_already = db.query(Vagas).filter(Vagas.titulo == titulo, Vagas.autor_id == autor_id).first()
    if has_already:
        print(f"Vaga with title '{titulo}' already exists for author ID {autor_id}.")
        return has_already
    vaga = Vagas(titulo=titulo, descricao=descricao, prazo=prazo, autor_id=autor_id, location_id=location_id, department_id=department_id, remuneracao=remuneracao, horas_complementares=horas_complementares, desconto=desconto, tipo_id=tipo_id, link_vaga=link_vaga, professor=professor)
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
    return db.query(Vagas).options(
        joinedload(Vagas.autor),
        joinedload(Vagas.tipo),
        joinedload(Vagas.department),
        joinedload(Vagas.location),
        joinedload(Vagas.interesses).joinedload(InteresseVaga.interesse)
    ).filter(Vagas.id == vaga_id).first()

def get_vagas(db: Session):
    return db.query(Vagas).options(
        joinedload(Vagas.autor),
        joinedload(Vagas.tipo),
        joinedload(Vagas.department),
    ).all()

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

def get_vagas_by_professor(db: Session, professor_id: int):
    print(f"=== Debug: Professor Vagas Endpoint ===")
    print(f"Request received for /professor endpoint")
    print(f"User ID: {professor_id}")
    print(f"=== End Debug ===")
    
    # First get all vagas for the professor
    vagas = db.query(Vagas).filter(Vagas.autor_id == professor_id).all()
    
    # For each vaga, get the candidate count
    result = []
    for vaga in vagas:
        candidates_count = db.query(func.count(CandidatoVaga.id)).filter(
            CandidatoVaga.vaga_id == vaga.id
        ).scalar()
        
        # Create department dict if it exists
        department_dict = None
        if vaga.department:
            department_dict = {
                "id": vaga.department.id,
                "name": vaga.department.name,
                "sigla": vaga.department.sigla
            }
            
        # Create tipo dict if it exists
        tipo_dict = None
        if vaga.tipo:
            tipo_dict = {
                "id": vaga.tipo.id,
                "nome": vaga.tipo.nome
            }
            
        # Create autor dict if it exists
        autor_dict = None
        if vaga.autor:
            autor_dict = {
                "id": vaga.autor.id,
                "usuario": vaga.autor.usuario,
                "email": vaga.autor.email,
                "ehaluno": vaga.autor.ehaluno,
                "avatar": vaga.autor.avatar,
                "criado_em": vaga.autor.criado_em,
                "email_verified": vaga.autor.email_verified
            }
        
        vaga_dict = {
            "id": vaga.id,
            "titulo": vaga.titulo,
            "descricao": vaga.descricao,
            "prazo": vaga.prazo,
            "tipo": tipo_dict,
            "remuneracao": vaga.remuneracao,
            "horas_complementares": vaga.horas_complementares,
            "desconto": vaga.desconto,
            "criado_em": vaga.criado_em,
            "autor": autor_dict,
            "department": department_dict,
            "link_vaga": vaga.link_vaga,
            "professor": vaga.professor,
            "status": vaga.status,
            "candidates": candidates_count
        }
        result.append(vaga_dict)
    
    print(f"Found {len(result)} vagas")
    if result:
        print(f"First vaga ID: {result[0]['id']}")
    return result
