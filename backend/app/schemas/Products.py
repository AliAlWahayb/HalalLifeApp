# model with aliases
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, model_validator
from sqlmodel import Field, SQLModel

from app.schemas.HalalCheck import ecodes, ingredient


# response model and table model with primary key
class productsResponse(SQLModel, table=True):
    # Define 'code' as the primary key
    code: float = Field(primary_key=True)
    product_name: str
    brands: str
    countries_en: str
    image_url: str
    halal_status: str

    # Optional: Add a table name if you want it to be different from the class name
    __tablename__ = "products_sample"