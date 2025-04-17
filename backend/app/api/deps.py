from typing import Generator, Optional, List, Dict, Any
from app.db.sqlite import SQLiteDB
from app.core.config import settings
import os
import json
from datetime import datetime


async def get_sqlite_db() -> Generator[SQLiteDB, None, None]:
    """
    Get SQLite DB connection for local storage
    """
    db = SQLiteDB()
    try:
        # Ensure the database file exists and tables are created
        db_file = settings.SQLITE_DB_PATH
        db_dir = os.path.dirname(db_file)

        # Create directory if it doesn't exist and not using current directory
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

        yield db
    finally:
        # SQLite cleanup happens automatically with aiosqlite
        pass


async def get_user_preferences(user_id: str) -> dict:
    """
    Get user preferences from local SQLite database
    """
    db = SQLiteDB()
    result = await db.select_where("user_preferences", "user_id = ?", (user_id,))

    preferences = {}
    for row in result:
        preferences[row["key"]] = row["value"]

    return preferences


async def save_user_preference(user_id: str, key: str, value: str) -> None:
    """
    Save a user preference to local SQLite database
    """
    db = SQLiteDB()

    # Check if the preference already exists
    existing = await db.select_where(
        "user_preferences",
        "user_id = ? AND key = ?",
        (user_id, key)
    )

    if existing:
        # Update existing preference
        await db.update(
            "user_preferences",
            {"value": value},
            "user_id = ? AND key = ?",
            (user_id, key)
        )
    else:
        # Insert new preference
        await db.insert(
            "user_preferences",
            {
                "user_id": user_id,
                "key": key,
                "value": value
            }
        )


# Ingredients functions
async def get_ingredients(search_query: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Get ingredients from SQLite, optionally filtered by search query
    """
    db = SQLiteDB()

    if search_query:
        # Search in name, barcode, or category
        return await db.select_where(
            "ingredients",
            "name LIKE ? OR barcode LIKE ? OR category LIKE ?",
            (f"%{search_query}%", f"%{search_query}%", f"%{search_query}%")
        )
    else:
        return await db.select_all("ingredients")


async def get_ingredient_by_id(ingredient_id: int) -> Optional[Dict[str, Any]]:
    """
    Get an ingredient by ID
    """
    db = SQLiteDB()
    results = await db.select_where("ingredients", "id = ?", (ingredient_id,))
    return results[0] if results else None


async def create_ingredient(data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Create a new ingredient and log to history
    """
    db = SQLiteDB()

    # Insert the ingredient
    await db.insert("ingredients", data)

    # Get the new ingredient's ID
    results = await db.select_where(
        "ingredients",
        "name = ? AND barcode = ?",
        (data["name"], data.get("barcode", ""))
    )

    if results:
        ingredient_id = results[0]["id"]

        # Log to history
        history_entry = {
            "ingredient_id": ingredient_id,
            "change_type": "create",
            "new_value": json.dumps(data),
            "changed_by": user_id
        }

        await db.insert("ingredients_history", history_entry)
        return results[0]

    return {}


async def update_ingredient(ingredient_id: int, data: Dict[str, Any], user_id: str) -> Optional[Dict[str, Any]]:
    """
    Update an ingredient and log changes to history
    """
    db = SQLiteDB()

    # Get the current ingredient
    current = await get_ingredient_by_id(ingredient_id)
    if not current:
        return None

    # Update the ingredient
    await db.update("ingredients", data, "id = ?", (ingredient_id,))

    # Log each changed field to history
    for key, new_value in data.items():
        if key in current and current[key] != new_value:
            history_entry = {
                "ingredient_id": ingredient_id,
                "change_type": "update",
                "field_name": key,
                "old_value": str(current[key]),
                "new_value": str(new_value),
                "changed_by": user_id
            }
            await db.insert("ingredients_history", history_entry)

    # Return the updated ingredient
    return await get_ingredient_by_id(ingredient_id)

# Products functions


async def get_products(search_query: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Get products from SQLite, optionally filtered by search query
    """
    db = SQLiteDB()

    if search_query:
        # Search in name, barcode, brand, or category
        return await db.select_where(
            "products",
            "name LIKE ? OR barcode LIKE ? OR brand LIKE ? OR category LIKE ?",
            (f"%{search_query}%", f"%{search_query}%",
             f"%{search_query}%", f"%{search_query}%")
        )
    else:
        return await db.select_all("products")


async def get_product_by_id(product_id: int) -> Optional[Dict[str, Any]]:
    """
    Get a product by ID
    """
    db = SQLiteDB()
    results = await db.select_where("products", "id = ?", (product_id,))
    return results[0] if results else None


async def create_product(data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Create a new product and log to history
    """
    db = SQLiteDB()

    # Insert the product
    await db.insert("products", data)

    # Get the new product's ID
    results = await db.select_where(
        "products",
        "name = ? AND barcode = ?",
        (data["name"], data.get("barcode", ""))
    )

    if results:
        product_id = results[0]["id"]

        # Log to history
        history_entry = {
            "product_id": product_id,
            "change_type": "create",
            "new_value": json.dumps(data),
            "changed_by": user_id
        }

        await db.insert("products_history", history_entry)
        return results[0]

    return {}


async def update_product(product_id: int, data: Dict[str, Any], user_id: str) -> Optional[Dict[str, Any]]:
    """
    Update a product and log changes to history
    """
    db = SQLiteDB()

    # Get the current product
    current = await get_product_by_id(product_id)
    if not current:
        return None

    # Update the product
    await db.update("products", data, "id = ?", (product_id,))

    # Log each changed field to history
    for key, new_value in data.items():
        if key in current and current[key] != new_value:
            history_entry = {
                "product_id": product_id,
                "change_type": "update",
                "field_name": key,
                "old_value": str(current[key]),
                "new_value": str(new_value),
                "changed_by": user_id
            }
            await db.insert("products_history", history_entry)

    # Return the updated product
    return await get_product_by_id(product_id)
