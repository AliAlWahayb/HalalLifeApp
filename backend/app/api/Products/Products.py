from fastapi import APIRouter



router = APIRouter()

@router.get("/")
def get_products():

    return {"message": f"tests" }

@router.get("/{id}")
def get_product(id: str):
    return {"message": f"testss {id}" }