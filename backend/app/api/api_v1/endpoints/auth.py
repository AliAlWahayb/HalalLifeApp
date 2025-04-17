from typing import Any, Dict
from datetime import timedelta
from fastapi import APIRouter, Body, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.schemas.user import User, UserCreate, Token
from app.crud.firebase_user import firebase_user_crud

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await firebase_user_crud.get_by_email(email=form_data.username)

    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")

    if not firebase_user_crud.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "access_token": create_access_token(
            subject=user["id"], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/register", response_model=Dict[str, Any])
async def register_user(
    *,
    user_in: UserCreate,
) -> Any:
    """
    Register a new user.
    """
    user = await firebase_user_crud.get_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )

    user = await firebase_user_crud.get_by_username(username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )

    user = await firebase_user_crud.create(user_in=user_in)
    return user


@router.post("/firebase-auth", response_model=Token)
async def firebase_auth(
    *,
    firebase_token: str = Body(..., embed=True),
) -> Any:
    """
    Authenticate with a Firebase token and get a server-side JWT
    (This would normally verify the Firebase ID token and create a server token)
    """
    # This is a simplified version - in production, you would verify the Firebase token
    # and extract the UID to identify the user

    # For demo purposes, let's assume the token is the user ID
    user_id = firebase_token

    user = await firebase_user_crud.get(user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            subject=user["id"], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
