from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from models.user import User
from models.vaga import Vagas
from models.recomendacao import Recomendacao
from services.recommendation_strategies import RecommendationEngine
from datetime import datetime, timedelta

class RecommendationService:
    """Service to manage pre-calculated recommendations"""
    
    def __init__(self):
        self.engine = RecommendationEngine()
    
    def calculate_and_store_recommendations(self, db: Session, user_id: int, strategies: Optional[List[str]] = None) -> bool:
        """Calculate and store recommendations for a specific user
        
        Args:
            db: Database session
            user_id: User ID
            strategies: List of specific strategies to calculate. If None, calculates all strategies.
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
        
                # Full refresh - clear all existing recommendations
            print(f"Full recommendation refresh for user {user_id}")
            db.query(Recomendacao).filter(Recomendacao.usuario_id == user_id).delete()
            strategies_to_calculate = [strategy.get_name() for strategy in self.engine.get_all_strategies()]
            print(f"strategies_to_calculate: {strategies_to_calculate}")

            
            # Get recommendations from specified strategies
            strategy_results = {}
            for strategy_name in strategies_to_calculate:
                strategy = self._get_strategy_by_name(strategy_name)
                if strategy:
                    strategy_recommendations = strategy.get_recommendations(db, user)
                    strategy_results[strategy_name] = strategy_recommendations
            
            # Combine results from all calculated strategies
            combined_recommendations = self._combine_strategy_results(strategy_results)
            
            # Store each recommendation
            for rec_data in combined_recommendations:
                vaga_id = rec_data['vaga_id']
                total_score = rec_data['total_score']
                strategies_data = rec_data['strategies']
                
                # Create explanation combining all strategies
                explanations = []
                for strategy in strategies_data:
                    explanations.append(f"• {strategy['explanation']}")
                
                combined_explanation = "\n".join(explanations)
                
                # Store recommendation for each strategy (for detailed analysis)
                for strategy in strategies_data:
                    recommendation = Recomendacao(
                        usuario_id=user_id,
                        vaga_id=vaga_id,
                        estrategia=strategy['name'],
                        score=strategy['score'],
                        explicacao=strategy['explanation'],
                        ativa=True
                    )
                    db.add(recommendation)
                
                # Store combined recommendation
                combined_recommendation = Recomendacao(
                    usuario_id=user_id,
                    vaga_id=vaga_id,
                    estrategia="combined",
                    score=total_score,
                    explicacao=combined_explanation,
                    ativa=True
                )
                db.add(combined_recommendation)
            
            db.commit()
            print(f"Successfully calculated and stored {len(combined_recommendations)} recommendations for user {user_id}")
            return True
            
        except Exception as e:
            print(f"Error calculating recommendations for user {user_id}: {e}")
            db.rollback()
            return False
    
    def calculate_strategy_recommendations(self, db: Session, user_id: int, strategy_name: str) -> bool:
        """Calculate and store recommendations for a specific strategy only"""
        return self.calculate_and_store_recommendations(db, user_id, [strategy_name])
    
    def _get_strategy_by_name(self, strategy_name: str):
        """Get strategy instance by name"""
        for strategy in self.engine.get_all_strategies():
            if strategy.get_name() == strategy_name:
                return strategy
        return None
    
    def _combine_strategy_results(self, strategy_results: Dict[str, List]) -> List[Dict]:
        """Combine results from multiple strategies"""
        # Group recommendations by vaga_id
        vaga_recommendations = {}
        
        for strategy_name, recommendations in strategy_results.items():
            strategy_obj = self._get_strategy_by_name(strategy_name)
            weight = strategy_obj.get_weight() if strategy_obj else 1.0
            
            for rec in recommendations:
                vaga_id = rec['vaga_id']
                
                if vaga_id not in vaga_recommendations:
                    vaga_recommendations[vaga_id] = {
                        'vaga_id': vaga_id,
                        'strategies': [],
                        'total_score': 0.0
                    }
                
                # Add strategy data
                vaga_recommendations[vaga_id]['strategies'].append({
                    'name': strategy_name,
                    'score': rec['score'],
                    'explanation': rec['explanation'],
                    'weight': weight
                })
                
                # Add to total score (weighted)
                vaga_recommendations[vaga_id]['total_score'] += rec['score'] * weight
        
        # Convert to list and sort by total score
        result = list(vaga_recommendations.values())
        result.sort(key=lambda x: x['total_score'], reverse=True)
        
        return result
    
    def calculate_recommendations_for_all_users(self, db: Session) -> Dict[str, int]:
        """Calculate recommendations for all users"""
        stats = {"success": 0, "failed": 0}
        
        # Get all users who are students (ehaluno=True)
        users = db.query(User).filter(User.ehaluno == True).all()
        
        for user in users:
            if self.calculate_and_store_recommendations(db, user.id):
                stats["success"] += 1
            else:
                stats["failed"] += 1
        
        return stats
    
    def get_user_recommendations(self, db: Session, user_id: int, limit: int = 10) -> List[Dict]:
        """Get stored recommendations for a user"""
        recommendations = db.query(Recomendacao).filter(
            Recomendacao.usuario_id == user_id,
            Recomendacao.estrategia == "combined",  # Get combined recommendations
            Recomendacao.ativa == True
        ).order_by(Recomendacao.score.desc()).limit(limit).all()
        
        result = []
        for rec in recommendations:
            # Get opportunity details with relationships
            vaga = db.query(Vagas).filter(Vagas.id == rec.vaga_id).first()
            if vaga and vaga.status == "em_andamento":  # Only active opportunities
                
                # Get individual strategy explanations
                strategy_recs = db.query(Recomendacao).filter(
                    Recomendacao.usuario_id == user_id,
                    Recomendacao.vaga_id == rec.vaga_id,
                    Recomendacao.estrategia != "combined",
                    Recomendacao.ativa == True
                ).all()
                
                strategies = []
                for strategy_rec in strategy_recs:
                    strategy_name = strategy_rec.estrategia
                    strategy_description = self._get_strategy_description(strategy_name)
                    
                    strategies.append({
                        "name": strategy_name,
                        "description": strategy_description,
                        "score": strategy_rec.score,
                        "explanation": strategy_rec.explicacao
                    })
                
                result.append({
                    "vaga_id": rec.vaga_id,
                    "vaga": {
                        "id": vaga.id,
                        "titulo": vaga.titulo,
                        "descricao": vaga.descricao,
                        "prazo": vaga.prazo.isoformat() if vaga.prazo else None,
                        "status": vaga.status,
                        "autor": {
                            "id": vaga.autor.id,
                            "nome": vaga.autor.nome,
                            "avatar": vaga.autor.avatar_url if hasattr(vaga.autor, 'avatar_url') else None
                        } if vaga.autor else None,
                        "tipo": {
                            "id": vaga.tipo.id,
                            "nome": vaga.tipo.nome
                        } if vaga.tipo else None,
                        "department": {
                            "id": vaga.department.id,
                            "name": vaga.department.name
                        } if vaga.department else None,
                        "location": {
                            "id": vaga.location.id,
                            "name": vaga.location.name
                        } if vaga.location else None
                    },
                    "total_score": rec.score,
                    "strategies": strategies,
                    "updated_at": rec.atualizado_em.isoformat() if rec.atualizado_em else None
                })
        
        return result
    
    def get_recommendation_explanation(self, db: Session, user_id: int, vaga_id: int) -> Optional[Dict]:
        """Get detailed explanation for a specific recommendation"""
        # Get all strategy recommendations for this user-vaga pair
        recommendations = db.query(Recomendacao).filter(
            Recomendacao.usuario_id == user_id,
            Recomendacao.vaga_id == vaga_id,
            Recomendacao.ativa == True
        ).all()
        
        if not recommendations:
            return None
        
        strategies = []
        total_score = 0
        
        for rec in recommendations:
            if rec.estrategia == "combined":
                total_score = rec.score
            else:
                strategy_description = self._get_strategy_description(rec.estrategia)
                strategies.append({
                    "name": rec.estrategia,
                    "description": strategy_description,
                    "score": rec.score,
                    "explanation": rec.explicacao
                })
        
        return {
            "vaga_id": vaga_id,
            "user_id": user_id,
            "total_score": total_score,
            "strategies": strategies
        }
    
    def _get_strategy_description(self, strategy_name: str) -> str:
        """Get description for a strategy"""
        for strategy in self.engine.get_all_strategies():
            if strategy.get_name() == strategy_name:
                return strategy.get_description()
        return "Estratégia personalizada"
    
    def should_refresh_recommendations(self, db: Session, user_id: int, max_age_hours: int = 48) -> bool:
        """Check if recommendations should be refreshed based on age"""
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
        
        recent_rec = db.query(Recomendacao).filter(
            Recomendacao.usuario_id == user_id,
            Recomendacao.atualizado_em >= cutoff_time,
            Recomendacao.ativa == True
        ).first()
        
        return recent_rec is None  # True if recommendations are old or don't exist
    
    def refresh_recommendations_if_needed(self, db: Session, user_id: int, max_age_hours: int = 48) -> bool:
        """Refresh recommendations if they are older than max_age_hours"""
        if self.should_refresh_recommendations(db, user_id, max_age_hours):
            return self.calculate_and_store_recommendations(db, user_id)
        
        return True  # Recommendations are still fresh

    def invalidate_recommendations_for_vaga(self, db: Session, vaga_id: int):
        """Invalidate all recommendations for a specific opportunity (e.g., when it's closed)"""
        try:
            updated_count = db.query(Recomendacao).filter(
                Recomendacao.vaga_id == vaga_id
            ).update({"ativa": False})
            
            db.commit()
            print(f"Invalidated {updated_count} recommendations for vaga {vaga_id}")
            
        except Exception as e:
            print(f"Error invalidating recommendations for vaga {vaga_id}: {e}")
            db.rollback()

    def invalidate_recommendations_for_user(self, db: Session, user_id: int):
        """Invalidate all recommendations for a specific user"""
        try:
            updated_count = db.query(Recomendacao).filter(
                Recomendacao.usuario_id == user_id
            ).update({"ativa": False})
            
            db.commit()
            print(f"Invalidated {updated_count} recommendations for user {user_id}")
            
        except Exception as e:
            print(f"Error invalidating recommendations for user {user_id}: {e}")
            db.rollback()

    def get_recommendation_stats(self, db: Session) -> Dict:
        """Get recommendation system statistics"""
        try:
            # Total active recommendations
            total_active = db.query(Recomendacao).filter(
                Recomendacao.ativa == True,
                Recomendacao.estrategia == "combined"
            ).count()
            
            # Users with recommendations
            users_with_recs = db.query(Recomendacao.usuario_id).filter(
                Recomendacao.ativa == True,
                Recomendacao.estrategia == "combined"
            ).distinct().count()
            
            # Average recommendations per user
            avg_recs_per_user = total_active / users_with_recs if users_with_recs > 0 else 0
            
            return {
                "total_active_recommendations": total_active,
                "users_with_recommendations": users_with_recs,
                "average_recommendations_per_user": round(avg_recs_per_user, 2)
            }
            
        except Exception as e:
            print(f"Error getting recommendation stats: {e}")
            return {
                "total_active_recommendations": 0,
                "users_with_recommendations": 0,
                "average_recommendations_per_user": 0.0
            } 