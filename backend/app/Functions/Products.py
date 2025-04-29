from typing import List
from sqlmodel import select

from app.database.database import SessionDep
from app.schemas.Products import productsResponse


def get_all_products(page: int, limit: int, session: SessionDep) -> List[productsResponse]:
    # Calculate offset
    offset = (page - 1) * limit
    if offset < 0: 
        offset = 0


    statement = select(productsResponse).offset(offset).limit(limit)

    results = session.exec(statement).all()

    return results