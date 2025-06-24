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
    def get_interests() -> List[Dict]:
        """Get interests - cached for 24 hours (rarely change)"""
        db = SessionLocal()
        try:
            interests = db.query(Interesses).all()
            return [{"id": interest.id, "nome": interest.nome} for interest in interests]
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