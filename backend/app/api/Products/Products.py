from fastapi import APIRouter, Depends

from app.Functions.HalalCheck import *
from app.Functions.Products import get_all_products
from app.database.database import get_session
from app.schemas.HalalCheck import WhyResponse
from app.schemas.Products import productsResponse



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

@router.get("/",
            response_model=List[productsResponse],
            status_code=status.HTTP_200_OK,
            summary="Get all Products",
            description="Get all Products from the local database")
async def get_all_products_endpoint(
    session: SessionDep ,
    page: int = Query(1, description="Page number", ge=1),
    limit: int = Query(20, description="Limit number", ge=1), 
):
    results = get_all_products(page, limit, session)

    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No matching entries found for the requested page/limit."
        )

    return results
