import json
from pathlib import Path
from typing import Annotated, Iterable, List, Set

from fastapi import HTTPException, Query, logger , status
import httpx
from sqlmodel import SQLModel, or_, select
from app.database.database import SessionDep
from app.schemas.HalalCheck import ecodes, ingredient, the_status

#to get a specific column
def extract_column_values(column_name: str, results: list[SQLModel]) -> list[str]:
    return [getattr(item, column_name).lower() for item in results]

# def find_matching_items(items_to_check: Iterable[str],
#                         *reference_lists: Iterable[str]) -> list[str]:
  
#     combined_reference_set: Set[str] = set()
#     for ref_list in reference_lists:
#         combined_reference_set.update(ref_list)

#     return [item for item in items_to_check if item in combined_reference_set]

def find_matching_items(
    items_to_check: Iterable[str],
    *reference_lists: Iterable[str]
) -> List[str]:

    combined_reference_set_lower: Set[str] = set()
    for ref_list in reference_lists:
        for item in ref_list:
            if item and isinstance(item, str):
                 combined_reference_set_lower.add(item.lower())
            # Optionally handle non-string items or None if necessary
            # else:
            #    print(f"Warning: Skipping non-string item in reference list: {item}")

    matched_items: List[str] = []
    for item in items_to_check:
        if item and isinstance(item, str):
            if item.lower() in combined_reference_set_lower:
                matched_items.append(item)
        # Optionally handle non-string items or None in items_to_check
        # else:
        #    print(f"Warning: Skipping non-string item in items_to_check: {item}")

    return matched_items



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


# async def get_from_openfoodfacts(barcode):
#     try:
#         # Step 1: Call external API
#         async with httpx.AsyncClient() as client:
#             response = await client.get(f"https://world.openfoodfacts.org/api/v3/product/{barcode}.json")
            
#             # Step 2: Check for successful response
#             if response.status_code != 200:
#                 raise HTTPException(
#                     status_code=response.status_code,
#                     detail="External API request failed"
#                 )
            
#             # Step 3: Process the data
#             external_data = response.json()
#             processed_data = {
#                 **external_data,
#                 "processed": True,
#                 "new_field": "additional_info"
#             }
            
#             # Step 4: Return modified data
#             return processed_data
            
#     except httpx.RequestError as e:
#         # Handle connection errors
#         raise HTTPException(
#             status_code=503,
#             detail="Service unavailable: Could not connect to external API"
#         )


def check_halal(data):
    
    # Clean and prepare ingredients list
    ingredients_tags = [
        tag.lower() for tag in data.get("_keywords", [])
    ]
    
    halal_keywords = [
        "vegan","halal-certified", "halal"
    ]  
    
    # Prepare result
    result = {
        "halal_status": "halal",
        "total_ingredients_checked": len(ingredients_tags)
    }

    Match = find_matching_items(ingredients_tags, halal_keywords)
    if Match:
        return result
    
    return None

def check_haram(data, session: SessionDep):
    
    # Clean and prepare ingredients list
    ingredients_tags = [
        tag.split(":")[1].lower() 
        for tag in data.get("ingredients_original_tags", [])
    ]
    
    # Get haram lists from database
    haram_ingredients_list = extract_column_values("ingredient_name", get_haram_ingredients(session))
    haram_ecodes_list = extract_column_values("ecode", get_haram_ecodes(session))
    
    Match = find_matching_items(ingredients_tags, haram_ingredients_list, haram_ecodes_list)
    
    # Prepare result
    result = {
        "halal_status": "haram",
        "haram_ingredients_found": Match,
        "total_ingredients_checked": len(ingredients_tags)
    }
    
    if Match:
        return result
    
    return None

def check_unknown(data, session: SessionDep ):
    
    # Clean and prepare ingredients list
    ingredients_tags = [
        tag.split(":")[1].lower() 
        for tag in data.get("ingredients_original_tags", [])
    ]
    
    # Get unknown lists from database
    unknown_ingredients_list = extract_column_values("ingredient_name", get_unknown_ingredients(session))
    unknown_ecodes_list = extract_column_values("ecode", get_unknown_ecodes(session))


    
    Match = find_matching_items(ingredients_tags, unknown_ingredients_list, unknown_ecodes_list)
    
    # Prepare result
    result = {
        "halal_status": "unknown",
        "unknown_ingredients_found": Match,
        "total_ingredients_checked": len(ingredients_tags)
    }
    
    if Match:
        return result
    
    return None


def check_all(data, session: SessionDep):
    halal_result = check_halal(data)
    haram_result = check_haram(data, session)
    unknown_result = check_unknown(data, session)
    
    if halal_result:
        return halal_result
    
    if haram_result:
        return haram_result
    
    if unknown_result:
        return unknown_result
    


def get_from_openfoodfacts_offline(session: SessionDep):
    file_path = "app/Functions/737628064502.json"
    try:
        # Step 1: Read the file
        file_path = Path(file_path)
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        # Step 2: Load JSON content
        with open(file_path, 'r', encoding='utf-8') as f:
            local_data = json.load(f)


        analysis_result = check_all(local_data, session)


        # Step 3: Process the data (same as API example)
        processed_data = {
            **local_data,
            "processed": True,
            "halal_analysis": analysis_result
        }

        # Optional: Write back modified data
        # with open(file_path, 'w', encoding='utf-8') as f:
        #     json.dump(processed_data, f, indent=2)

        return processed_data

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")