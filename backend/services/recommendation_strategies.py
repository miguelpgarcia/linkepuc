from abc import ABC, abstractmethod
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from models.user import User
from models.vaga import Vagas
from models.interesse_usuario import InteresseUsuario
from models.interesse_vaga import InteresseVaga
from models.candidato_vaga import CandidatoVaga
from sqlalchemy import func, and_

class RecommendationStrategy(ABC):
    """Base class for all recommendation strategies"""
    
    @abstractmethod
    def get_name(self) -> str:
        """Return the strategy name"""
        pass
    
    @abstractmethod
    def calculate_recommendations(self, db: Session, user: User) -> List[Tuple[int, float, str]]:
        """
        Calculate recommendations for a user
        Returns: List of (vaga_id, score, explanation)
        """
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        """Return strategy description"""
        pass
    
    @abstractmethod
    def get_weight(self) -> float:
        """Return the weight for this strategy in combined recommendations"""
        pass
    
    def get_recommendations(self, db: Session, user: User) -> List[Dict]:
        """
        Get recommendations in the format expected by the service
        Returns: List of {'vaga_id': int, 'score': float, 'explanation': str}
        """
        recommendations = self.calculate_recommendations(db, user)
        return [
            {
                'vaga_id': vaga_id,
                'score': score,
                'explanation': explanation
            }
            for vaga_id, score, explanation in recommendations
        ]


class CommonInterestsStrategy(RecommendationStrategy):
    """Recommend opportunities based on common interests between user and opportunities"""
    
    def get_name(self) -> str:
        return "common_interests"
    
    def get_description(self) -> str:
        return "Baseado nos seus interesses em comum"
    
    def get_weight(self) -> float:
        return 0.7  # Higher weight for interest-based recommendations
    
    def calculate_recommendations(self, db: Session, user: User) -> List[Tuple[int, float, str]]:
        recommendations = []
        
        # Get user interests
        user_interests = db.query(InteresseUsuario).filter(
            InteresseUsuario.usuario_id == user.id
        ).all()
        
        if not user_interests:
            return recommendations
        
        user_interest_ids = [ui.interesse_id for ui in user_interests]
        
        # Get all active opportunities
        vagas = db.query(Vagas).filter(Vagas.status == "em_andamento").all()
        
        for vaga in vagas:
            # Skip if user already applied
            already_applied = db.query(CandidatoVaga).filter(
                and_(CandidatoVaga.vaga_id == vaga.id, CandidatoVaga.candidato_id == user.id)
            ).first()
            
            if already_applied:
                continue
            
            # Get opportunity interests
            vaga_interests = db.query(InteresseVaga).filter(
                InteresseVaga.vaga_id == vaga.id
            ).all()
            
            if not vaga_interests:
                continue
            
            vaga_interest_ids = [vi.interesse_id for vi in vaga_interests]
            
            # Calculate common interests
            common_interests = set(user_interest_ids).intersection(set(vaga_interest_ids))
            
            if common_interests:
                # Calculate score based on percentage of common interests
                score = len(common_interests) / len(vaga_interest_ids)
                
                # Get interest names for explanation
                common_interest_names = []
                for interest_id in common_interests:
                    interest = db.query(InteresseUsuario).filter(
                        InteresseUsuario.interesse_id == interest_id,
                        InteresseUsuario.usuario_id == user.id
                    ).first()
                    if interest and interest.interesse:
                        common_interest_names.append(interest.interesse.nome)
                
                explanation = f"Você tem {len(common_interests)} interesse(s) em comum: {', '.join(common_interest_names[:3])}"
                if len(common_interest_names) > 3:
                    explanation += f" e mais {len(common_interest_names) - 3}"
                
                recommendations.append((vaga.id, score, explanation))
        
        return recommendations


class PopularOpportunitiesStrategy(RecommendationStrategy):
    """Recommend opportunities based on popularity (most applied)"""
    
    def get_name(self) -> str:
        return "popular"
    
    def get_description(self) -> str:
        return "Baseado na popularidade entre outros estudantes"
    
    def get_weight(self) -> float:
        return 0.3  # Lower weight for popularity-based recommendations
    
    def calculate_recommendations(self, db: Session, user: User) -> List[Tuple[int, float, str]]:
        recommendations = []
        
        # Get opportunities with candidate count
        vaga_popularity = db.query(
            Vagas.id,
            Vagas.titulo,
            func.count(CandidatoVaga.id).label('candidate_count')
        ).outerjoin(CandidatoVaga).filter(
            Vagas.status == "em_andamento"
        ).group_by(Vagas.id, Vagas.titulo).all()
        
        if not vaga_popularity:
            return recommendations
        
        # Calculate max candidates for normalization
        max_candidates = max([vp.candidate_count for vp in vaga_popularity])
        
        for vaga_pop in vaga_popularity:

            
            # Calculate score based on popularity
            if max_candidates > 0:
                score = vaga_pop.candidate_count / max_candidates
            else:
                score = 0.0
            
            # Only recommend if there are at least some candidates
            if vaga_pop.candidate_count > 0:
                explanation = f"Esta oportunidade já atraiu {vaga_pop.candidate_count} candidato(s)"
                recommendations.append((vaga_pop.id, score, explanation))
        
        return recommendations


class RecommendationEngine:
    """Main recommendation engine that orchestrates all strategies"""
    
    def __init__(self):
        self.strategies = [
            CommonInterestsStrategy(),
            PopularOpportunitiesStrategy(),
        ]
    
    def get_all_strategies(self) -> List[RecommendationStrategy]:
        """Get all available strategies"""
        return self.strategies
    
    def add_strategy(self, strategy: RecommendationStrategy):
        """Add a new strategy to the engine"""
        self.strategies.append(strategy)
    
    def calculate_all_recommendations(self, db: Session, user: User) -> Dict[str, List[Tuple[int, float, str]]]:
        """Calculate recommendations using all strategies"""
        all_recommendations = {}
        
        for strategy in self.strategies:
            try:
                recommendations = strategy.calculate_recommendations(db, user)
                all_recommendations[strategy.get_name()] = recommendations
            except Exception as e:
                print(f"Error in strategy {strategy.get_name()}: {e}")
                all_recommendations[strategy.get_name()] = []
        
        return all_recommendations
    
    def get_combined_recommendations(self, db: Session, user: User, limit: int = 10) -> List[Dict]:
        """Get combined recommendations from all strategies with weights"""
        strategy_weights = {
            "common_interests": 0.7,  # Give more weight to interest-based recommendations
            "popular": 0.3,
        }
        
        all_recommendations = self.calculate_all_recommendations(db, user)
        combined_scores = {}
        
        # Combine scores from all strategies
        for strategy_name, recommendations in all_recommendations.items():
            weight = strategy_weights.get(strategy_name, 0.5)
            
            for vaga_id, score, explanation in recommendations:
                if vaga_id not in combined_scores:
                    combined_scores[vaga_id] = {
                        'total_score': 0.0,
                        'strategies': []
                    }
                
                weighted_score = score * weight
                combined_scores[vaga_id]['total_score'] += weighted_score
                combined_scores[vaga_id]['strategies'].append({
                    'name': strategy_name,
                    'score': score,
                    'explanation': explanation,
                    'weight': weight
                })
        
        # Sort by total score and return top recommendations
        sorted_recommendations = sorted(
            combined_scores.items(),
            key=lambda x: x[1]['total_score'],
            reverse=True
        )
        
        result = []
        for vaga_id, data in sorted_recommendations[:limit]:
            result.append({
                'vaga_id': vaga_id,
                'total_score': data['total_score'],
                'strategies': data['strategies']
            })
        
        return result 