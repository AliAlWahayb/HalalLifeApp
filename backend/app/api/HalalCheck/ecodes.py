from fastapi import APIRouter, HTTPException, Query, status
from app.Functions.HalalCheck import *
from app.database.database import SessionDep
from typing import Annotated

from app.schemas.HalalCheck import ecodes


router = APIRouter()

@router.get("/" , status_code=status.HTTP_200_OK , response_model=list[ecodes] ,summary="Get all ecodes" ,description="Get all ecodes from the sqlite database")
def get_ecodes_endpoint(
    session: SessionDep,
) -> list[ecodes]:
    ecodes_list = get_ecodes_from_db(session)
    if not ecodes_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return ecodes_list

@router.get("/halal", status_code=status.HTTP_200_OK , response_model=list[ecodes] ,summary="Get all halal ecodes" ,description="Get all halal ecodes from the sqlite database")
def get_halal_ecodes_endpoint(
    session: SessionDep,
): 
    halal_list = get_halal_ecodes(session)
    if not halal_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return halal_list

@router.get("/haram", status_code=status.HTTP_200_OK , response_model=list[ecodes], summary="Get all haram ecodes" ,description="Get all haram ecodes from the sqlite database")
def get_haram_ecodes_endpoint(
    session: SessionDep,
): 
    haram_list = get_haram_ecodes(session)
    if not haram_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return haram_list

@router.get("/unknown", status_code=status.HTTP_200_OK , response_model=list[ecodes], summary="Get all unknown ecodes" ,description="Get all unknown ecodes from the sqlite database")
def get_unknown_ecodes_endpoint(
    session: SessionDep,
) -> list[ecodes]: 
    unknown_list = get_unknown_ecodes(session)
    if not unknown_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ecodes not found")
    return unknown_list