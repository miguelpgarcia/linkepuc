from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from pathlib import Path

# Try to find .env file
env_path = Path(os.getcwd()) / ".env"


# Load environment variables
load_dotenv(env_path)

# Get DATABASE_URL, handling potential BOM character
database_url = None
for key in os.environ:
    if key.strip('\ufeff') == 'DATABASE_URL':
        database_url = os.environ[key]
        break



if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Base.metadata.create_all(bind=engine)  # Ensure this is executed to create tables

