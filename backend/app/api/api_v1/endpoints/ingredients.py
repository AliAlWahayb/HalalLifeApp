from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Body, Depends, HTTPException, Query
from app.core.security import get_current_active_user
from app.api.deps import (
    get_ingredients,
    get_ingredient_by_id,
    create_ingredient,
    update_ingredient
)

router = APIRouter()


@router.get("/", response_model=List[Dict[str, Any]])
async def read_ingredients(
    search: Optional[str] = Query(
        None, description="Search term for filtering ingredients"),
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve ingredients from the local SQLite database.
    """
    ingredients = await get_ingredients(search_query=search)
    return ingredients


@router.post("/", response_model=Dict[str, Any])
async def add_ingredient(
    ingredient: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Create a new ingredient in the local SQLite database.
    """
    # Validate the ingredient data
    required_fields = ["name", "halal_status"]
    for field in required_fields:
        if field not in ingredient:
            raise HTTPException(
                status_code=400,
                detail=f"Field '{field}' is required"
            )

    # Create the ingredient
    created_ingredient = await create_ingredient(
        data=ingredient,
        user_id=current_user["id"]
    )

    if not created_ingredient:
        raise HTTPException(
            status_code=500,
            detail="Failed to create ingredient"
        )

    return created_ingredient


@router.get("/{ingredient_id}", response_model=Dict[str, Any])
async def read_ingredient(
    ingredient_id: int,
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific ingredient by ID.
    """
    ingredient = await get_ingredient_by_id(ingredient_id)

    if not ingredient:
        raise HTTPException(
            status_code=404,
            detail=f"Ingredient with ID {ingredient_id} not found"
        )

    return ingredient


@router.put("/{ingredient_id}", response_model=Dict[str, Any])
async def update_ingredient_endpoint(
    ingredient_id: int,
    ingredient_update: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_active_user),
) -> Any:
    """
    Update an ingredient and log changes in history.
    """
    # Check if ingredient exists
    existing_ingredient = await get_ingredient_by_id(ingredient_id)
    if not existing_ingredient:
        raise HTTPException(
            status_code=404,
            detail=f"Ingredient with ID {ingredient_id} not found"
        )

    # Update the ingredient
    updated_ingredient = await update_ingredient(
        ingredient_id=ingredient_id,
        data=ingredient_update,
        user_id=current_user["id"]
    )

    if not updated_ingredient:
        raise HTTPException(
            status_code=500,
            detail="Failed to update ingredient"
        )

    return updated_ingredient
