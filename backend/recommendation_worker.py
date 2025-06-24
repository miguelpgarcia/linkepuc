#!/usr/bin/env python3
"""
Simple Background Recommendation Worker
Runs separately to update user recommendations using existing database
No Redis, no Docker complexity - just works with your existing setup
"""

import time
import logging
from datetime import datetime, timedelta
from typing import List
import threading

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import your existing models and services first
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.base import SessionLocal, Base, engine
from services.recommendation_service import RecommendationService

# Import ALL models to ensure SQLAlchemy relationships work properly
from models.user import User
from models.recomendacao import Recomendacao
from models.interesse import Interesses
from models.interesse_usuario import InteresseUsuario
from models.interesse_vaga import InteresseVaga
from models.vaga import Vagas
from models.candidato_vaga import CandidatoVaga
from models.departamento import Departamento
from models.tipo_vaga import Tipo
from models.localizacao import Location
from models.historico import Historico
from models.mensagem import Mensagem
from models.disciplinas import Disciplina
from models.publicacao import Publicacao

# Initialize database tables
Base.metadata.create_all(bind=engine)

class SimpleRecommendationWorker:
    def __init__(self):
        self.service = RecommendationService()
        self.running = False
        logger.info("🚀 Simple Recommendation Worker initialized")
    
    def update_user_recommendations(self, user_id: int) -> bool:
        """Update recommendations for a specific user"""
        db = SessionLocal()
        try:
            logger.info(f"Updating recommendations for user {user_id}")
            success = self.service.calculate_and_store_recommendations(db, user_id)
            
            if success:
                logger.info(f"✅ Updated recommendations for user {user_id}")
            else:
                logger.error(f"❌ Failed to update recommendations for user {user_id}")
            
            return success
        except Exception as e:
            logger.error(f"Error updating recommendations for user {user_id}: {e}")
            return False
        finally:
            db.close()
    
    def update_all_users(self):
        """Update recommendations for all active users"""
        db = SessionLocal()
        try:
            # Get all verified student users
            users = db.query(User).filter(
                User.ehaluno == True,
                User.email_verified == True
            ).all()
            
            logger.info(f"Found {len(users)} users to update")
            
            success_count = 0
            for user in users:
                if self.update_user_recommendations(user.id):
                    success_count += 1
                time.sleep(2)  # Small delay to avoid overwhelming the database
            
            logger.info(f"🎉 Updated recommendations for {success_count}/{len(users)} users")
            
        except Exception as e:
            logger.error(f"Error in batch update: {e}")
        finally:
            db.close()
    
    def cleanup_old_recommendations(self):
        """Clean up old inactive recommendations"""
        db = SessionLocal()
        try:
            cutoff_date = datetime.now() - timedelta(days=30)
            
            deleted_count = db.query(Recomendacao).filter(
                Recomendacao.ativa == False,
                Recomendacao.atualizado_em < cutoff_date
            ).delete()
            
            db.commit()
            logger.info(f"🧹 Cleaned up {deleted_count} old recommendations")
            
        except Exception as e:
            logger.error(f"Error cleaning up recommendations: {e}")
            db.rollback()
        finally:
            db.close()
    
    def start(self):
        """Start the background worker"""
        logger.info("🏃‍♂️ Starting Simple Recommendation Worker...")
        self.running = True
        
        # Run initial update
        self.update_all_users()
        
        # Main loop - update every 2 hours
        while self.running:
            try:
                logger.info("💤 Sleeping for 2 hours...")
                time.sleep(2 * 60 * 60)  # 2 hours
                
                if self.running:
                    self.update_all_users()
                    
                # Cleanup once a day (every 12 cycles)
                if datetime.now().hour == 3:  # 3 AM
                    self.cleanup_old_recommendations()
                    
            except KeyboardInterrupt:
                logger.info("🛑 Worker stopped by user")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Worker error: {e}")
                time.sleep(60)  # Wait before retrying
    
    def stop(self):
        """Stop the worker"""
        self.running = False
        logger.info("🛑 Worker stop requested")

def main():
    """Main entry point"""
    worker = SimpleRecommendationWorker()
    try:
        worker.start()
    except KeyboardInterrupt:
        worker.stop()

if __name__ == "__main__":
    main() 