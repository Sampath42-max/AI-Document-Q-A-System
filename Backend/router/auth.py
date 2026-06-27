from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from Database import create_db_user, authenticate_db_user, save_or_update_user
import base64
import json

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/auth/signup")
async def signup(request: SignupRequest):
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Standard registration is disabled. Only Google Auth is supported."
    )

@router.post("/auth/login")
async def login(request: LoginRequest):
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Standard login is disabled. Only Google Auth is supported."
    )

class GoogleLoginRequest(BaseModel):
    credential: str

@router.post("/auth/google")
async def google_login(request: GoogleLoginRequest):
    if not request.credential:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credential token is required"
        )
    
    
    try:
        parts = request.credential.split('.')
        if len(parts) != 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token format"
            )
        
        payload_b64 = parts[1]
        # Fix base64 padding
        payload_b64 += '=' * (4 - len(payload_b64) % 4)
        payload_json = base64.urlsafe_b64decode(payload_b64).decode('utf-8')
        payload = json.loads(payload_json)
        
        google_id = payload.get('sub')
        email = payload.get('email')
        name = payload.get('name')
        picture = payload.get('picture')
        
        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token payload missing required fields"
            )
        
        user_data = save_or_update_user(
            google_id=google_id,
            email=email.strip().lower(),
            name=name or email.split('@')[0],
            picture=picture or ""
        )
        
        return user_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )
