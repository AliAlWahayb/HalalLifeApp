from fastapi import APIRouter

from app.Functions.HalalCheck import *



router = APIRouter()



@router.get("/{barcode}" , status_code=status.HTTP_200_OK , summary="Get product by barcode" ,description="Get product by id from the openfoodfacts database")
async def get_product_endpoint(barcode: int, session: SessionDep):
    result = await get_from_openfoodfacts(barcode, session)

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found at get_product_endpoint")
    return result


@router.get("/offline" , status_code=status.HTTP_200_OK , summary="Get product by barcode" ,description="Get product by id from the local files for testing")
def get_product_endpoint(
    session: SessionDep,
):
    result = get_from_openfoodfacts_offline(session)

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return result