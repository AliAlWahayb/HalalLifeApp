from fastapi import APIRouter, HTTPException, status
from app.database.database import SessionDep
from typing import Optional
from sqlmodel import SQLModel, Field, select

class status_code(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status_nm: str = Field(index=True)



router = APIRouter()


@router.get("/" , status_code=status.HTTP_200_OK , response_model=list[status_code])
def get_status(
    session: SessionDep,
): 
    statement = select(status_code)
    query = session.exec(statement).all()
    if query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
    return query

@router.get("/{status_name}", status_code=status.HTTP_200_OK , response_model=status_code)
def get_status_id(
    session: SessionDep,
    status_name: str
): 
    statement = select(status_code).where(status_code.status_nm.ilike(status_name))
    query = session.exec(statement).first()
    if query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
    return query

