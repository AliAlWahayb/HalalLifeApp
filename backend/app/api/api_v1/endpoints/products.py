from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Body, Depends, HTTPException, Query
from app.core.security import get_current_active_user
from app.api.deps import (
    get_products,
    get_product_by_id,
    create_product,
    update_product
)

router = APIRouter()


@router.get("/", response_model=List[Dict[str, Any]])
async def read_products(
    search: Optional[str] = Query(
        None, description="Search term for filtering products"),
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve products from the local SQLite database.
    """
    products = await get_products(search_query=search)
    return products


@router.post("/", response_model=Dict[str, Any])
async def add_product(
    product: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Create a new product in the local SQLite database.
    """
    # Validate the product data
    required_fields = ["name", "halal_status"]
    for field in required_fields:
        if field not in product:
            raise HTTPException(
                status_code=400,
                detail=f"Field '{field}' is required"
            )

    # Create the product
    created_product = await create_product(
        data=product,
        user_id=current_user["id"]
    )

    if not created_product:
        raise HTTPException(
            status_code=500,
            detail="Failed to create product"
        )

    return created_product


@router.get("/{product_id}", response_model=Dict[str, Any])
async def read_product(
    product_id: int,
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific product by ID.
    """
    product = await get_product_by_id(product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Product with ID {product_id} not found"
        )

    return product


@router.put("/{product_id}", response_model=Dict[str, Any])
async def update_product_endpoint(
    product_id: int,
    product_update: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Update a product and log changes in history.
    """
    # Check if product exists
    existing_product = await get_product_by_id(product_id)
    if not existing_product:
        raise HTTPException(
            status_code=404,
            detail=f"Product with ID {product_id} not found"
        )

    # Update the product
    updated_product = await update_product(
        product_id=product_id,
        data=product_update,
        user_id=current_user["id"]
    )

    if not updated_product:
        raise HTTPException(
            status_code=500,
            detail="Failed to update product"
        )

    return updated_product
