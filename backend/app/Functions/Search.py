from typing import Annotated

from fastapi import Query
from app.Functions.HalalCheck import get_ecodes_from_db, get_ingredients
from app.Functions.Helpers import *
from app.database.database import SessionDep

def get_all_search(
    session: SessionDep,
): 
    ingredients = get_ingredients(session)
    ecodes= get_ecodes_from_db(session)
    result = ingredients + ecodes
    
    return result