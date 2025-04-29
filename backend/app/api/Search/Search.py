from fastapi import APIRouter, Depends

from app.Functions.HalalCheck import *
from app.Functions.Search import get_all_search
from app.database.database import get_session
from app.schemas.HalalCheck import WhyResponse
from app.schemas.Search import searchResponse



router = APIRouter()



@router.get("/ingredients", status_code=status.HTTP_200_OK , response_model=list[ingredient] ,summary="Get all ingredients" ,description="Get all ingredients from the sqlite database")
async def search_ingredients_endpoint( session: SessionDep):
    results = get_ingredients(session)
    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching entries found")
    return results

@router.get("/ecodes", status_code=status.HTTP_200_OK , response_model=list[ecodes] ,summary="Get all ecodes" ,description="Get all ecodes from the sqlite database")
async def search_ecodes_endpoint( session: SessionDep):
    results = get_ecodes_from_db(session)
    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching entries found")
    return results

@router.get("/all", status_code=status.HTTP_200_OK , response_model=list[searchResponse] ,summary="Get all search" ,description="Get all search from the local database")
async def get_presses_all_endpoint( session: SessionDep):
    results = get_all_search( session)  
    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching entries found")
    return results
