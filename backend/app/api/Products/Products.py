from fastapi import APIRouter, Depends

from app.Functions.HalalCheck import *
from app.database.database import get_session
from app.schemas.HalalCheck import WhyResponse



router = APIRouter()



@router.get("/{barcode}" , status_code=status.HTTP_200_OK , summary="Get product by barcode" ,description="Get product by id from the openfoodfacts database")
async def get_product_endpoint(barcode: int, session: SessionDep):
    result = await get_from_openfoodfacts(barcode, session)

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found at get_product_endpoint")
    return result


@router.get("/ecodes/", 
           response_model=List[EcodesResponse],
           status_code=status.HTTP_200_OK,
           summary="Get all why",
           description="Get all why from the local database")
async def get_presses_why_endpoint(
    session: SessionDep ,
    reasons: List[str] = Query(..., description="List of search terms"),
):
    results = process_Ecodes(reasons, session)  
    
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No matching entries found"
        )
    
    return results