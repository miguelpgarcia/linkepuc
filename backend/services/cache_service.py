"""
Simple Backend Cache Service
Uses Python's built-in lru_cache - no Redis, no bullshit
Perfect for static data that rarely changes
"""

from functools import lru_cache, wraps
import time
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models.base import SessionLocal
from models.tipo_vaga import Tipo
from models.departamento import Departamento
from models.interesse import Interesses

# TTL Cache decorator for data that changes occasionally
def ttl_cache(seconds: int = 3600):
    """Time-to-live cache decorator"""
    def decorator(func):
        cache = {}
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            key = str(args) + str(sorted(kwargs.items()))
            
            if key in cache:
                result, timestamp = cache[key]
                if now - timestamp < seconds:
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, now)
            return result
        
        wrapper.cache_clear = lambda: cache.clear()
        return wrapper
    return decorator

class StaticDataCache:
    """Cache for static data that rarely changes"""
    
    @staticmethod
    @lru_cache(maxsize=1)  # Only cache 1 result since it's the same data
    def get_opportunity_types() -> List[Dict]:
        """Get opportunity types - cached forever (they never change)"""
        db = SessionLocal()
        try:
            tipos = db.query(Tipo).all()
            return [{"id": tipo.id, "nome": tipo.nome} for tipo in tipos]
        finally:
            db.close()
    
    @staticmethod
    @ttl_cache(seconds=24 * 60 * 60)  # Cache for 24 hours
    def get_departments() -> List[Dict]:
        """Get departments - cached for 24 hours (rarely change)"""
        db = SessionLocal()
        try:
            departments = db.query(Departamento).all()
            return [{"id": dept.id, "name": dept.name, "sigla": dept.sigla} for dept in departments]
        finally:
            db.close()
    
    @staticmethod
    @ttl_cache(seconds=24 * 60 * 60)  # Cache for 24 hours  
    def get_interests() -> Dict[str, List[Dict]]:
        """Get interests organized by category - cached for 24 hours (rarely change)"""
        db = SessionLocal()
        try:
            interests = db.query(Interesses).all()
            
            # Organize interests by category
            interests_by_category = {}
            
            for interest in interests:
                # Use "Outros" as default category if categoria is None or empty
                categoria = interest.categoria if interest.categoria else "Outros"
                
                if categoria not in interests_by_category:
                    interests_by_category[categoria] = []
                
                interests_by_category[categoria].append({
                    "id": interest.id, 
                    "nome": interest.nome,
                    "categoria": categoria
                })
            
            # Sort categories alphabetically, but put "Outros" at the end
            sorted_categories = {}
            other_categories = sorted([cat for cat in interests_by_category.keys() if cat != "Outros"])
            
            for categoria in other_categories:
                sorted_categories[categoria] = sorted(interests_by_category[categoria], key=lambda x: x["nome"])
            
            # Add "Outros" at the end if it exists
            if "Outros" in interests_by_category:
                sorted_categories["Outros"] = sorted(interests_by_category["Outros"], key=lambda x: x["nome"])
            
            return sorted_categories
        finally:
            db.close()
    
    @classmethod
    def clear_all_cache(cls):
        """Clear all cached data (for admin use)"""
        cls.get_opportunity_types.cache_clear()
        cls.get_departments.cache_clear()
        cls.get_interests.cache_clear()
        print("✅ All static data cache cleared")

# Global instance
static_cache = StaticDataCache() 