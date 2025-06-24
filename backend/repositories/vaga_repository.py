from sqlalchemy.orm import Session
from models.vaga import Vagas
from sqlalchemy.orm import joinedload
from models.interesse_vaga import InteresseVaga
from sqlalchemy import func
from models.candidato_vaga import CandidatoVaga
from functools import lru_cache
from models.base import SessionLocal



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

@lru_cache(maxsize=128)
def get_vagas_cached(skip: int = 0, limit: int = 20):
    db = SessionLocal()
    print("Skip: ", skip)
    print("Limit: ", limit)
    try:
        # First get total count for pagination info
        total = db.query(Vagas).count()
        
        # Then get paginated results with all needed relationships
        result = db.query(Vagas).options(
            joinedload(Vagas.autor),
            joinedload(Vagas.tipo),
            joinedload(Vagas.department),
            joinedload(Vagas.interesses).joinedload(InteresseVaga.interesse)
        ).order_by(Vagas.criado_em.desc()).offset(skip).limit(limit).all()
        
        return result
    finally:
        db.close()

def get_vagas(db: Session, skip: int = 0, limit: int = 20, user_id: int = None):
    # Get total count for pagination info
    total = db.query(Vagas).filter(Vagas.status == "em_andamento").count()
    
    recommended_vagas = []
    regular_vagas = []
    recommendations_data = {}
    
    # MARKET-STANDARD APPROACH: Use pre-computed cached recommendations (like Netflix/Amazon)
    # instead of calculating them on-the-fly
    if user_id:
        from models.recomendacao import Recomendacao
        
        # Get PRE-COMPUTED recommendations from database (FAST!)
        cached_recommendations = db.query(Recomendacao).filter(
            Recomendacao.usuario_id == user_id,
            Recomendacao.estrategia == "combined",  # Get combined recommendations
            Recomendacao.ativa == True
        ).order_by(Recomendacao.score.desc()).limit(5).all()
        
        if cached_recommendations:
            # Get vaga IDs from cached recommendations
            recommended_vaga_ids = [rec.vaga_id for rec in cached_recommendations]
            
            # Store cached recommendation data
            for rec in cached_recommendations:
                recommendations_data[rec.vaga_id] = {
                    'score': rec.score,
                    'explanation': rec.explicacao
                }
            
            # Fetch the actual recommended vagas
            recommended_vagas = db.query(Vagas).options(
                joinedload(Vagas.autor),
                joinedload(Vagas.tipo),
                joinedload(Vagas.department),
                joinedload(Vagas.location),
                joinedload(Vagas.interesses).joinedload(InteresseVaga.interesse)
            ).filter(
                Vagas.id.in_(recommended_vaga_ids),
                Vagas.status == "em_andamento"
            ).all()
            
            # Sort by recommendation score (from cache)
            recommended_vagas.sort(
                key=lambda v: recommendations_data.get(v.id, {}).get('score', 0),
                reverse=True
            )
            
            # Get remaining regular vagas
            remaining_limit = limit - len(recommended_vagas)
            if remaining_limit > 0:
                regular_vagas = db.query(Vagas).options(
                    joinedload(Vagas.autor),
                    joinedload(Vagas.tipo),
                    joinedload(Vagas.department),
                    joinedload(Vagas.location),
                    joinedload(Vagas.interesses).joinedload(InteresseVaga.interesse)
                ).filter(
                    Vagas.status == "em_andamento",
                    ~Vagas.id.in_(recommended_vaga_ids)
                ).order_by(Vagas.criado_em.desc()).offset(skip).limit(remaining_limit).all()
    
    # If no user or no cached recommendations, get regular vagas
    if not recommended_vagas and not regular_vagas:
        regular_vagas = db.query(Vagas).options(
            joinedload(Vagas.autor),
            joinedload(Vagas.tipo),
            joinedload(Vagas.department),
            joinedload(Vagas.location),
            joinedload(Vagas.interesses).joinedload(InteresseVaga.interesse)
        ).filter(Vagas.status == "em_andamento").order_by(Vagas.criado_em.desc()).offset(skip).limit(limit).all()
    
    # Combine recommended + regular vagas
    all_vagas = recommended_vagas + regular_vagas
    
    # Convert to dict format
    result = []
    for i, vaga in enumerate(all_vagas):
        # Get cached recommendation data if available
        recommendation_score = 0.0
        recommendation_explanation = ""
        recommendation_strategies = []
        is_recommended = i < len(recommended_vagas)  # First batch are recommended
        
        if vaga.id in recommendations_data:
            recommendation_score = recommendations_data[vaga.id]['score']
            recommendation_explanation = recommendations_data[vaga.id]['explanation']
            
            # Get detailed strategy explanations for this vaga
            if user_id:
                strategy_recommendations = db.query(Recomendacao).filter(
                    Recomendacao.usuario_id == user_id,
                    Recomendacao.vaga_id == vaga.id,
                    Recomendacao.ativa == True,
                    Recomendacao.estrategia != "combined"
                ).all()
                
                for strategy_rec in strategy_recommendations:
                    strategy_name = strategy_rec.estrategia
                    strategy_description = "Baseado nos seus interesses"
                    
                    # Get proper strategy description
                    if strategy_name == "common_interests":
                        strategy_description = "Baseado nos seus interesses em comum"
                    elif strategy_name == "popular":
                        strategy_description = "Baseado na popularidade entre outros estudantes"
                    
                    recommendation_strategies.append({
                        "name": strategy_name,
                        "description": strategy_description,
                        "score": strategy_rec.score,
                        "explanation": strategy_rec.explicacao
                    })
        
        vaga_dict = {
            "id": vaga.id,
            "titulo": vaga.titulo,
            "descricao": vaga.descricao,
            "prazo": vaga.prazo.isoformat() if vaga.prazo else None,
            "status": vaga.status,
            "criado_em": vaga.criado_em.isoformat() if vaga.criado_em else None,
            "remuneracao": vaga.remuneracao,
            "horas_complementares": vaga.horas_complementares,
            "desconto": vaga.desconto,
            "link_vaga": vaga.link_vaga,
            "professor": vaga.professor,
            "autor": {
                "id": vaga.autor.id,
                "nome": vaga.autor.usuario,  # Use usuario field
                "usuario": vaga.autor.usuario,
                "email": vaga.autor.email,
                "avatar": vaga.autor.avatar
            } if vaga.autor else None,
            "tipo": {
                "id": vaga.tipo.id,
                "nome": vaga.tipo.nome
            } if vaga.tipo else None,
            "department": {
                "id": vaga.department.id,
                "name": vaga.department.name,
                "sigla": vaga.department.sigla
            } if vaga.department else None,
            "location": {
                "id": vaga.location.id,
                "name": vaga.location.name
            } if vaga.location else None,
            "interesses": [
                {
                    "interesse": {
                        "id": iv.interesse.id,
                        "nome": iv.interesse.nome
                    }
                } for iv in vaga.interesses
            ],
            # SMART: Use cached recommendation data (FAST!)
            "isRecommended": is_recommended,
            "recommendationScore": recommendation_score,
            "recommendationExplanation": recommendation_explanation,
            "recommendationStrategies": recommendation_strategies
        }
        result.append(vaga_dict)
    
    return {"vagas": result, "total": total, "recommended_count": len(recommended_vagas)}

def update_vaga(db: Session, vaga_id: int, titulo: str, descricao: str, prazo: str):
    vaga = db.query(Vagas).filter(Vagas.id == vaga_id).first()
    if vaga:
        vaga.titulo = titulo
        vaga.descricao = descricao
        vaga.prazo = prazo
        db.commit()
        db.refresh(vaga)
    return vaga

def update_vaga_status(db: Session, vaga_id: int, status: str):
    vaga = db.query(Vagas).filter(Vagas.id == vaga_id).first()
    if vaga:
        vaga.status = status
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
