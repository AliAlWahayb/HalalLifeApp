from fastapi import APIRouter, HTTPException, status
from app.Functions.HalalCheck import get_status, get_status_id
from app.database.database import SessionDep
from sqlmodel import select

from app.schemas.HalalCheck import the_status




router = APIRouter()


@router.get("/" , status_code=status.HTTP_200_OK , response_model=list[the_status], summary="Get all status" ,description="Get all status from the sqlite database")
def get_status_endpoint(
    session: SessionDep,
): 
    status_list = get_status(session)
    if not status_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
    return status_list

@router.get("/{status_name}", status_code=status.HTTP_200_OK , response_model=the_status, summary="Get status by name" ,description="Get status by name from the sqlite database")
def get_status_id_endpoint(
    session: SessionDep,
    status_name: str
): 
    status_id = get_status_id(session, status_name)
    if not status_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
    return status_id
