from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, model_validator
from sqlmodel import Field, SQLModel

from app.schemas.HalalCheck import ecodes, ingredient
# model with aliases
class searchResponse(BaseModel):
    name: str
    category: Optional[str] = None
    id_status: int

    @model_validator(mode='before')
    @classmethod
    def map_fields(cls, data: Any) -> Dict[str, Any]:
        # Handle SQLModel instances
        if isinstance(data, (ecodes, ingredient)):
            return {
                "name": data.ecode if isinstance(data, ecodes) else data.ingredient_name,
                "category": data.category if isinstance(data, ecodes) else "",
                "id_status": data.id_status
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