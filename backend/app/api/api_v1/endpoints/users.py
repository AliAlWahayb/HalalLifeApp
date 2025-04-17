from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import get_current_active_user, get_current_active_superuser
from app.schemas.user import User, UserCreate, UserUpdate
from app.crud.firebase_user import firebase_user_crud

router = APIRouter()


@router.get("/", response_model=List[Dict[str, Any]])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = await firebase_user_crud.get_multi(skip=skip, limit=limit)
    return users


@router.post("/", response_model=Dict[str, Any])
async def create_user(
    *,
    user_in: UserCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    user = await firebase_user_crud.get_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await firebase_user_crud.create(user_in=user_in)
    return user


@router.get("/me", response_model=Dict[str, Any])
async def read_user_me(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=Dict[str, Any])
async def update_user_me(
    *,
    user_in: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user = await firebase_user_crud.update(user_id=current_user["id"], user_in=user_in)
    return user


@router.get("/{user_id}", response_model=Dict[str, Any])
async def read_user_by_id(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific user by id.
    """
    user = await firebase_user_crud.get(user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user["id"] == current_user["id"]:
        return user

    if not firebase_user_crud.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )

    return user
