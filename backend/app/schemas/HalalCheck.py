from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, model_validator
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

#WhyResponse model with aliases
class WhyResponse(BaseModel):
    name: str
    desc: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def map_fields(cls, data: Any) -> Dict[str, Any]:
        # Handle SQLModel instances
        if isinstance(data, (ecodes, ingredient)):
            return {
                "name": data.ecode if isinstance(data, ecodes) else data.ingredient_name,
                "desc": data.desc
            }
        # Handle dictionaries
        if isinstance(data, dict):
            if "ecode" in data:
                data["name"] = data.pop("ecode")
            elif "ingredient_name" in data:
                data["name"] = data.pop("ingredient_name")
        return data

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

#EcodesResponse model with aliases
class EcodesResponse(BaseModel):
    name: str
    ingredient_name: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def map_fields(cls, data: Any) -> Dict[str, Any]:
        
        if isinstance(data, ecodes):
             return {
                 "name": data.ecode,
                 "ingredient_name": data.ingredient_name
             }
        if isinstance(data, dict):
             return data

        return data

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


#response model to only return the ingredient name
# class IngredientNameResponse(SQLModel):
#     ingredient_name: str



