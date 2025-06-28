from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status, BackgroundTasks
from utils.jwt_utils import create_access_token
from sqlalchemy.orm import Session
from repositories.user_repository import (
    create_user,
    get_user_by_email,
    get_user,
    get_users,
    get_user_with_interests,
    update_user,
    delete_user,
    verify_password,
    get_user_by_verification_token,
)
from models.base import SessionLocal
from pydantic import BaseModel
from typing import Optional
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
from dependecies import get_current_user
from services.email_service import generate_verification_token, get_token_expiry, send_verification_email
from services.recommendation_service import RecommendationService
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError

# Load environment variables from .env file
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

user_router = APIRouter()

# Initialize recommendation service
recommendation_service = RecommendationService()

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
    sobre: Optional[str] = None

class VerifyEmailRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@user_router.post("/")
async def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        existing_user = get_user_by_email(db, user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        from repositories.user_repository import get_user_by_username
        existing_username = get_user_by_username(db, user.usuario)
        print(f"Existing user with username: {existing_username}")
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Validate email domain for professors (non-students)
        if not user.ehaluno:  # If user is not a student (i.e., is a professor)
            valid_domains = ["@puc-rio.br", "@inf.puc-rio.br"]
            is_valid_email = any(user.email.endswith(domain) for domain in valid_domains)
            if not is_valid_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Professors must use institutional professor email (for now @puc-rio.br or @inf.puc-rio.br are valid, email me if you need help: mpgarcia.br@gmail.com)"
                )
        
        # Create user with individual parameters
        db_user = create_user(
            db=db,
            usuario=user.usuario,
            password=user.password,
            ehaluno=user.ehaluno,
            email=user.email
        )
        
        # Generate verification token and expiry
        token_expiry = datetime.utcnow() + timedelta(hours=24)
        token_data = {
            "sub": str(db_user.id),
            "exp": token_expiry
        }
        token = jwt.encode(token_data, os.getenv("SECRET_KEY"), algorithm="HS256")
        
        # Save token and expiry to database
        db_user.verification_token = token
        db_user.verification_token_expires = token_expiry
        db.commit()
        
        try:
            # Send verification email with is_student parameter
            await send_verification_email(db_user.email, token, user.ehaluno)
        except Exception as e:
            # Log the error but don't fail the registration
            print(f"Warning: Failed to send verification email: {str(e)}")
            # Continue without failing the registration
            pass
        
        return {
            "message": "User created successfully. Please check your email to verify your account.",
            "user_id": db_user.id
        }
    except HTTPException:
        # Re-raise HTTP exceptions (they already have proper status codes)
        raise
    except Exception as e:
        print(f"Unexpected error in user creation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during user creation"
        )

@user_router.post("/verify-email")
async def verify_email_endpoint(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    try:
        print(f"Verifying email with token: {request.token}")
        # Decode the token
        payload = jwt.decode(request.token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = int(payload["sub"])
        print(f"Decoded user_id from token: {user_id}")
        
        # Get user and verify
        user = get_user(db, user_id)
        if not user:
            print(f"No user found with id: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        print(f"Found user: {user.usuario}")
        print(f"Current email_verified status: {user.email_verified}")
        
        # Update user's email verification status
        user.email_verified = True
        db.commit()
        db.refresh(user)
        
        print(f"Updated email_verified status: {user.email_verified}")
        
        # Generate access token for automatic login
        access_token = create_access_token(data={"user_id": user.id, "is_student": user.ehaluno})
        
        return {
            "message": "Email verified successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "is_student": user.ehaluno,
            "user_id": user.id,
            "user_name": user.usuario
        }
    except JWTError as e:
        print(f"JWT Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@user_router.post("/forgot-password")
async def forgot_password_endpoint(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        user = get_user_by_email(db, request.email)
        if not user:
            # Don't reveal if email exists or not for security
            return {"message": "If this email is registered, you will receive a password reset link."}
        
        # Generate reset token (24 hour expiry)
        token_expiry = datetime.utcnow() + timedelta(hours=24)
        token_data = {
            "sub": str(user.id),
            "type": "password_reset",
            "exp": token_expiry
        }
        reset_token = jwt.encode(token_data, os.getenv("SECRET_KEY"), algorithm="HS256")
        
        # Save reset token to database
        user.reset_token = reset_token
        user.reset_token_expires = token_expiry
        db.commit()
        
        # Send reset email
        from services.email_service import send_password_reset_email
        await send_password_reset_email(user.email, reset_token, user.ehaluno)
        
        return {"message": "If this email is registered, you will receive a password reset link."}
    except Exception as e:
        print(f"Error in forgot password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process password reset request"
        )

@user_router.post("/reset-password")
async def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        # Decode and validate token
        payload = jwt.decode(request.token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = int(payload["sub"])
        token_type = payload.get("type")
        
        if token_type != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token type"
            )
        
        # Get user and verify token
        user = get_user(db, user_id)
        if not user or user.reset_token != request.token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Check if token is expired
        if user.reset_token_expires and datetime.utcnow() > user.reset_token_expires:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired"
            )
        
        # Update password and clear reset token
        from repositories.user_repository import update_user_password
        update_user_password(db, user.id, request.new_password)
        
        # Clear reset token
        user.reset_token = None
        user.reset_token_expires = None
        db.commit()
        
        return {"message": "Password reset successfully"}
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    except Exception as e:
        print(f"Error in reset password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@user_router.get("/")
async def read_users_endpoint(db: Session = Depends(get_db)):
    return get_users(db)

@user_router.get("/{id}")
async def read_user_endpoint(id: int, db: Session = Depends(get_db)):
    user = get_user_with_interests(db, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Format the response to include interests
    user_data = {
        "id": user.id,
        "usuario": user.usuario,
        "email": user.email,
        "ehaluno": user.ehaluno,
        "sobre": user.sobre,
        "avatar": user.avatar,
        "criado_em": user.criado_em,
        "email_verified": user.email_verified,
        "interesses": [
            {
                "id": interesse_usuario.interesse.id,
                "nome": interesse_usuario.interesse.nome
            }
            for interesse_usuario in user.interesses
        ]
    }
    return user_data

@user_router.put("/{id}")
async def update_user_endpoint(id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updated = update_user(db, id, user.usuario, user.ehaluno, user.sobre)
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

@user_router.delete("/{id}/avatar")
async def delete_avatar(id: int, db: Session = Depends(get_db)):
    user = get_user(db, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Remove the avatar URL from the database
    user.avatar = None
    db.commit()
    db.refresh(user)

    return {"message": "Avatar deleted successfully"}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@user_router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    email, password = request.email, request.password
    print(f"Attempting login for email: {email}")
    
    user = get_user_by_email(db, email)
    if not user:
        print(f"No user found with email: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"User found: {user.usuario}")
    print(f"Email verified: {user.email_verified}")
    
    if not verify_password(password, user.password):
        print("Password verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.email_verified:
        print("Email not verified")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print("Login successful")
    

    
    # Create JWT token with user type
    access_token = create_access_token(data={"user_id": user.id, "is_student": user.ehaluno})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "is_student": user.ehaluno
    }