import os
import aiosqlite
from typing import List, Dict, Any, Optional
from app.core.config import settings


class SQLiteDB:
    """Async SQLite Database Manager for local storage"""

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.SQLITE_DB_PATH

    async def _get_connection(self):
        """Get a database connection"""
        return await aiosqlite.connect(self.db_path)

    async def execute_query(self, query: str, params: tuple = ()):
        """Execute a query and return results"""
        async with await self._get_connection() as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute(query, params)
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    async def execute(self, query: str, params: tuple = ()):
        """Execute a query without returning results"""
        async with await self._get_connection() as conn:
            await conn.execute(query, params)
            await conn.commit()

    async def create_table(self, table_name: str, columns: Dict[str, str]):
        """Create a table if it doesn't exist"""
        columns_str = ", ".join(
            [f"{name} {type_}" for name, type_ in columns.items()])
        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_str})"
        await self.execute(query)

    async def insert(self, table_name: str, data: Dict[str, Any]):
        """Insert data into a table"""
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data])
        values = tuple(data.values())

        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        await self.execute(query, values)

    async def select_all(self, table_name: str):
        """Select all rows from a table"""
        query = f"SELECT * FROM {table_name}"
        return await self.execute_query(query)

    async def select_where(self, table_name: str, condition: str, params: tuple = ()):
        """Select rows with a condition"""
        query = f"SELECT * FROM {table_name} WHERE {condition}"
        return await self.execute_query(query, params)

    async def update(self, table_name: str, data: Dict[str, Any], condition: str, params: tuple = ()):
        """Update rows in a table"""
        set_clause = ", ".join([f"{key} = ?" for key in data.keys()])
        values = tuple(data.values()) + params

        query = f"UPDATE {table_name} SET {set_clause} WHERE {condition}"
        await self.execute(query, values)

    async def delete(self, table_name: str, condition: str, params: tuple = ()):
        """Delete rows from a table"""
        query = f"DELETE FROM {table_name} WHERE {condition}"
        await self.execute(query, params)

    async def table_exists(self, table_name: str) -> bool:
        """Check if a table exists"""
        query = "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
        result = await self.execute_query(query, (table_name,))
        return len(result) > 0


async def initialize_sqlite_tables():
    """Initialize SQLite tables for the HalalLife app"""
    db = SQLiteDB()

    # Ingredients table
    await db.create_table("ingredients", {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "name": "TEXT NOT NULL",
        "barcode": "TEXT",
        "category": "TEXT",
        "halal_status": "TEXT NOT NULL",  # 'halal', 'haram', 'mushbooh', 'unknown'
        "description": "TEXT",
        "source": "TEXT",
        "certification": "TEXT",
        "notes": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    })

    # Products table
    await db.create_table("products", {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "name": "TEXT NOT NULL",
        "barcode": "TEXT",
        "brand": "TEXT",
        "category": "TEXT",
        "halal_status": "TEXT NOT NULL",  # 'halal', 'haram', 'mushbooh', 'unknown'
        "ingredients_list": "TEXT",  # Comma-separated list of ingredient IDs or names
        "certification": "TEXT",
        "image_url": "TEXT",
        "notes": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    })

    # Ingredients history table
    await db.create_table("ingredients_history", {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "ingredient_id": "INTEGER NOT NULL",
        "change_type": "TEXT NOT NULL",  # 'create', 'update', 'delete'
        "field_name": "TEXT",  # Which field was changed, null for create/delete
        "old_value": "TEXT",
        "new_value": "TEXT",
        "changed_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "changed_by": "TEXT"  # User who made the change
    })

    # Products history table
    await db.create_table("products_history", {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "product_id": "INTEGER NOT NULL",
        "change_type": "TEXT NOT NULL",  # 'create', 'update', 'delete'
        "field_name": "TEXT",  # Which field was changed, null for create/delete
        "old_value": "TEXT",
        "new_value": "TEXT",
        "changed_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "changed_by": "TEXT"  # User who made the change
    })
