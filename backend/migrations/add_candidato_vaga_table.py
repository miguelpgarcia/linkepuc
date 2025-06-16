from sqlalchemy import create_engine, Column, Integer, TIMESTAMP, ForeignKey, text
from sqlalchemy.sql import text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get DATABASE_URL
database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine
engine = create_engine(database_url)

# Create a connection
with engine.connect() as connection:
    # Create candidato_vaga table
    connection.execute(text("""
        CREATE TABLE IF NOT EXISTS candidato_vaga (
            id SERIAL PRIMARY KEY,
            candidato_id INTEGER NOT NULL REFERENCES usuarios(id),
            vaga_id INTEGER NOT NULL REFERENCES vagas(id),
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(candidato_id, vaga_id)
        )
    """))
    
    # Add status column to vagas table if it doesn't exist
    connection.execute(text("""
        DO $$ 
        BEGIN 
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'vagas' 
                AND column_name = 'status'
            ) THEN
                ALTER TABLE vagas 
                ADD COLUMN status VARCHAR NOT NULL DEFAULT 'em_andamento';
            END IF;
        END $$;
    """))
    
    # Commit the transaction
    connection.commit()

print("Migration completed successfully!") 