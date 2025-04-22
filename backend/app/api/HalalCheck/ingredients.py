from fastapi import APIRouter, HTTPException, Query, status
from app.Functions.HalalCheck import *
from app.database.database import SessionDep
from typing import Annotated
from sqlmodel import or_, select

from app.schemas.HalalCheck import ingredient, the_status



router = APIRouter()

@router.get("/" , status_code=status.HTTP_200_OK , response_model=list[ingredient] ,summary="Get all ingredients" ,description="Get all ingredients from the sqlite database")
def get_ingredients_endpoint(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[ingredient]: 
    ingredients_list = get_ingredients(session, offset, limit)
    if not ingredients_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ingredients not found")
    return ingredients_list

@router.get("/halal", status_code=status.HTTP_200_OK , response_model=list[ingredient] ,summary="Get all halal ingredients" ,description="Get all halal ingredients from the sqlite database")
def get_halal_ingredients_endpoint(
    session: SessionDep,
) -> list[ingredient]: 
    halal_list = get_halal_ingredients(session)
    if not halal_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ingredients not found")
    return halal_list
    

@router.get("/haram", status_code=status.HTTP_200_OK , response_model=list[ingredient] ,summary="Get all haram ingredients" ,description="Get all haram ingredients from the sqlite database")
def get_haram_ingredients_endpoint(
    session: SessionDep,
) -> list[ingredient]: 
    haram_list = get_haram_ingredients(session)
    if not haram_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ingredients not found")
    return haram_list

@router.get("/unknown", status_code=status.HTTP_200_OK , response_model=list[ingredient] ,summary="Get all unknown ingredients" ,description="Get all unknown ingredients from the sqlite database")
def get_unknown_ingredients_endpoint(
    session: SessionDep,
) -> list[ingredient]: 
    unknown_list = get_unknown_ingredients(session)
    if not unknown_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ingredients not found")
    return unknown_list