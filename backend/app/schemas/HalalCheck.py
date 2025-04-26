from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class ecodes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ecode: str = Field(index=True)
    ingredient_name: str = Field(index=True)
    category: str = Field(index=True)
    id_status: int = Field(index=True)
    desc: str = Field(index=True)


class the_status(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status_nm: str = Field(index=True)

class ingredient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ecode: str = Field(index=True)
    ingredient_name: str = Field(index=True)
    id_status: int = Field(index=True)
    desc: str = Field(index=True)

#response model to only return the ingredient name
# class IngredientNameResponse(SQLModel):
#     ingredient_name: str

class product(BaseModel):
    code : str
    product: list[str]
    additives_tags: list[str]
    allergens: list[str]
    image_front_url: str
    ingredients: list[str]
    ingredients_original_tags: list[str]
    nutriments: dict
    product_name: str
    quantity: str
    processed: bool
    halal_analysis: dict