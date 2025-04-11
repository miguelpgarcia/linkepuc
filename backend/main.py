from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from models import Base, User, Interesses, Vagas
from repositories import get_interesses,create_interesse, get_interesse, update_interesse, delete_interesse, get_users, create_user, get_user, update_user, delete_user, get_vagas, create_vaga, get_vaga, update_vaga, delete_vaga
import uvicorn
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta



engine = os.getenv("DATABASE_URL", "sqlite:///./test.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class InteresseCreate(BaseModel):
    nome: str

class InteresseUpdate(BaseModel):
    nome: str

class UserCreate(BaseModel):
    usuario: str
    password: str
    ehaluno: bool

class UserUpdate(BaseModel):
    usuario: str
    ehaluno: bool

class VagaCreate(BaseModel):
    titulo: str
    descricao: str
    prazo: str
    autor_id: int

class VagaUpdate(BaseModel):
    titulo: str
    descricao: str
    prazo: str

# Authentication settings
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db = next(get_db())
    user = get_user(db, int(user_id))
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
async def hello_world():
    return {"message": "Hello, World!"}

@app.post("/interesses/")
async def create_interesse_endpoint(interesse: InteresseCreate, db: SessionLocal = Depends(get_db)):
    return create_interesse(db, interesse.nome)


@app.get("/interesses/")
async def read_interesses_endpoint(db: SessionLocal = Depends(get_db)):
    interesses = get_interesses(db)
    return interesses

@app.get("/interesses/{id}")
async def read_interesse_endpoint(id: int, db: SessionLocal = Depends(get_db)):
    interesse = get_interesse(db, id)
    if not interesse:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return interesse

@app.put("/interesses/{id}")
async def update_interesse_endpoint(id: int, interesse: InteresseUpdate, db: SessionLocal = Depends(get_db)):
    updated = update_interesse(db, id, interesse.nome)
    if not updated:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return updated

@app.delete("/interesses/{id}")
async def delete_interesse_endpoint(id: int, db: SessionLocal = Depends(get_db)):
    deleted = delete_interesse(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interesse not found")
    return {"message": "Interesse deleted successfully"}

@app.post("/users/")
async def create_user_endpoint(user: UserCreate, db: SessionLocal = Depends(get_db)):
    return create_user(db, user.usuario, user.password,user.ehaluno)

@app.get("/users/")
async def read_users_endpoint(db: SessionLocal = Depends(get_db)):
    return get_users(db)

# Example of a protected route
@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/users/{id}")
async def read_user_endpoint(id: int, db: SessionLocal = Depends(get_db)):
    user = get_user(db, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{id}")
async def update_user_endpoint(id: int, user: UserUpdate, db: SessionLocal = Depends(get_db)):
    updated = update_user(db, id, user.usuario, user.ehaluno)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@app.delete("/users/{id}")
async def delete_user_endpoint(id: int, db: SessionLocal = Depends(get_db)):
    deleted = delete_user(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@app.post("/vagas/")
async def create_vaga_endpoint(vaga: VagaCreate, db: SessionLocal = Depends(get_db)):
    return create_vaga(db, vaga.titulo, vaga.descricao, vaga.prazo, vaga.autor_id)

@app.get("/vagas/")
async def read_vagas_endpoint(db: SessionLocal = Depends(get_db)):
    return get_vagas(db)

@app.get("/vagas/{id}")
async def read_vaga_endpoint(id: int, db: SessionLocal = Depends(get_db)):
    vaga = get_vaga(db, id)
    if not vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return vaga

@app.put("/vagas/{id}")
async def update_vaga_endpoint(id: int, vaga: VagaUpdate, db: SessionLocal = Depends(get_db)):
    updated = update_vaga(db, id, vaga.titulo, vaga.descricao, vaga.prazo)
    if not updated:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return updated

@app.delete("/vagas/{id}")
async def delete_vaga_endpoint(id: int, db: SessionLocal = Depends(get_db)):
    deleted = delete_vaga(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return {"message": "Vaga deleted successfully"}

# Add a /token endpoint for login
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/token")
async def login(request: LoginRequest, db: SessionLocal = Depends(get_db)):
    user = db.query(User).filter(User.usuario == request.username).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)