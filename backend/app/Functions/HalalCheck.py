from typing import Annotated

from fastapi import HTTPException, Query, logger , status
from sqlmodel import or_, select
from app.database.database import SessionDep
from app.schemas.HalalCheck import ecodes, ingredient, the_status


def get_ecodes_from_db(
    session: SessionDep,
    offset: int = 0,
    limit: int = 100
) -> list[ecodes]:
        statement = select(ecodes).offset(offset).limit(limit)
        result = session.exec(statement).all()
        return result

def get_halal_ecodes(
    session: SessionDep,
) -> list[ecodes]: 
    halal_status = select(the_status).where(the_status.status_nm.ilike("halal"))
    result = session.exec(halal_status).first()
    statement = select(ecodes).where(ecodes.id_status == result.id)
    result = session.exec(statement).all()
    
    return result

def get_haram_ecodes(
    session: SessionDep,
) -> list[ecodes]: 
    haram_status = select(the_status).where(the_status.status_nm.ilike("haram"))
    result = session.exec(haram_status).first()
    statement = select(ecodes).where(ecodes.id_status == result.id)
    result = session.exec(statement).all()
    
    return result

def get_unknown_ecodes(
    session: SessionDep,
): 
    unknown_status = select(the_status).where(or_(
        the_status.status_nm.ilike("Mushbooh"),
        the_status.status_nm.ilike("Depends")
    ))
    result = session.exec(unknown_status).all()
    statement = select(ecodes).where(ecodes.id_status.in_([status.id for status in result]))
    result = session.exec(statement).all()
   
    return result

def get_ingredients(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query()] = 100,
): 
    statement = select(ingredient).offset(offset).limit(limit)
    result = session.exec(statement).all()
    
    return result

def get_halal_ingredients(
    session: SessionDep,
): 
    halal_status = select(the_status).where(the_status.status_nm.ilike("halal"))
    result = session.exec(halal_status).first()
    statement = select(ingredient).where(ingredient.id_status == result.id)
    result = session.exec(statement).all()

    return result

def get_haram_ingredients(
    session: SessionDep,
): 
    haram_status = select(the_status).where(the_status.status_nm.ilike("haram"))
    result = session.exec(haram_status).first()
    statement = select(ingredient).where(ingredient.id_status == result.id)
    result = session.exec(statement).all()
    
    return result

def get_unknown_ingredients(
    session: SessionDep,
): 
    unknown_status = select(the_status).where(or_(
        the_status.status_nm.ilike("Mushbooh"),
        the_status.status_nm.ilike("Depends")
    ))
    result = session.exec(unknown_status).all()
    statement = select(ingredient).where(ingredient.id_status.in_([status.id for status in result]))
    result = session.exec(statement).all()
    
    return result

def get_status(
    session: SessionDep,
): 
    statement = select(the_status)
    result = session.exec(statement).all()
    
    return result

def get_status_id(
    session: SessionDep,
    status_name: str
): 
    statement = select(the_status).where(the_status.status_nm.ilike(status_name))
    result = session.exec(statement).first()
    
    return result