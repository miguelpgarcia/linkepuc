from fastapi import APIRouter, Depends, HTTPException, File, UploadFile,status
from utils.jwt_utils import create_access_token


from sqlalchemy.orm import Session
from repositories.user_repository import *
from models.base import SessionLocal
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
from dependecies import get_current_user_id


# Load environment variables from .env file
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

user_router = APIRouter()

class UserCreate(BaseModel):
    usuario: str
    email: str
    password: str
    ehaluno: bool

class LoginRequest(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    usuario: str
    ehaluno: bool

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@user_router.post("/")
async def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user.usuario, user.password, user.ehaluno, user.email)

@user_router.get("/")
async def read_users_endpoint(db: Session = Depends(get_db)):
    return get_users(db)

@user_router.get("/{id}")
async def read_user_endpoint(id: int, db: Session = Depends(get_db)):
    user = get_user(db, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.put("/{id}")
async def update_user_endpoint(id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updated = update_user(db, id, user.usuario, user.ehaluno)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@user_router.delete("/{id}")
async def delete_user_endpoint(id: int, db: Session = Depends(get_db)):
    deleted = delete_user(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@user_router.post("/{id}/avatar")
async def upload_avatar(id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = get_user(db, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Upload the file to Cloudinary
    try:
        result = cloudinary.uploader.upload(file.file, folder="avatars/")
        avatar_url = result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

    # Update the user's avatar URL in the database
    user.avatar = avatar_url
    db.commit()
    db.refresh(user)

    return {"message": "Avatar uploaded successfully", "avatar_url": avatar_url}



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@user_router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    email, password = request.email, request.password
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create JWT token
    access_token = create_access_token(data={"user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
