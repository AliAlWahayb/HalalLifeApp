from fastapi import APIRouter, HTTPException, Query, status
from app.api.HalalCheck.status import status_code
from app.database.database import SessionDep
from typing import Optional, Annotated
from sqlmodel import SQLModel, Field, or_, select



class ecodes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ecode: str = Field(index=True)
    ingredient_name: str = Field(index=True)
    category: str = Field(index=True)
    id_status: int = Field(index=True)
    desc: str = Field(index=True)

router = APIRouter()

@router.get("/" , status_code=status.HTTP_200_OK , response_model=list[ecodes])
def get_ecodes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
): 
    statement = select(ecodes).offset(offset).limit(limit)
    query = session.exec(statement).all()
    if query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return query

@router.get("/halal", status_code=status.HTTP_200_OK , response_model=list[ecodes])
def get_halal_ecodes(
    session: SessionDep,
): 
    halal_status = select(status_code).where(status_code.status_nm.ilike("halal"))
    query = session.exec(halal_status).first()
    statement = select(ecodes).where(ecodes.id_status == query.id)
    query = session.exec(statement).all()
    if query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return query

@router.get("/haram", status_code=status.HTTP_200_OK , response_model=list[ecodes])
def get_haram_ecodes(
    session: SessionDep,
): 
    haram_status = select(status_code).where(status_code.status_nm.ilike("haram"))
    query = session.exec(haram_status).first()
    statement = select(ecodes).where(ecodes.id_status == query.id)
    query = session.exec(statement).all()
    if query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return query

@router.get("/unknown", status_code=status.HTTP_200_OK , response_model=list[ecodes])
def get_unknown_ecodes(
    session: SessionDep,
): 
    unknown_status = select(status_code).where(or_(
        status_code.status_nm.ilike("Mushbooh"),
        status_code.status_nm.ilike("Depends")
    ))
    query = session.exec(unknown_status).all()
    statement = select(ecodes).where(ecodes.id_status.in_([status.id for status in query]))
    query = session.exec(statement).all()
    if query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return query