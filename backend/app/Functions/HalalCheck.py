import json
from pathlib import Path
import stat
from typing import Annotated, Iterable, List, Set

from fastapi import HTTPException, Query, logger , status
import httpx
from sqlmodel import SQLModel, or_, select
from app.Functions.Helpers import *
from app.database.database import SessionDep
from app.schemas.HalalCheck import EcodesResponse, WhyResponse, ecodes, ingredient, the_status





def get_ecodes_from_db(
    session: SessionDep,
) -> list[ecodes]:
        statement = select(ecodes)
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
): 
    statement = select(ingredient)
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



def process_why(why_list: List[str], session: SessionDep) -> List[WhyResponse]:
    results: List[WhyResponse] = []

    for name in why_list:
        ecode_result = session.exec(
            select(ecodes).where(ecodes.ecode.ilike(name))
        ).first()

        if ecode_result:
            results.append(WhyResponse.model_validate(ecode_result))
            continue # Move to the next name once a match is found

        ingredient_result = session.exec(
            select(ingredient).where(ingredient.ingredient_name.ilike(name))
        ).first()

        if ingredient_result:
            results.append(WhyResponse.model_validate(ingredient_result))
            continue # Move to the next name once a match is found

        # Default case if no match is found
        default_data = {
            "name": name,
            "desc": "unknown"
        }
        results.append(WhyResponse.model_validate(default_data))

    return results

def process_Ecodes(ecodes_list: List[str], session: SessionDep) -> List[EcodesResponse]:
    results: List[EcodesResponse] = []

    for name in ecodes_list:
        ecode_result = session.exec(
            select(ecodes).where(ecodes.ecode.ilike(name))
        ).first()

        if ecode_result:
            results.append(EcodesResponse.model_validate(ecode_result))
            continue # Move to the next name once a match is found

        # Default case if no match is found
        default_data = {
            "name": name,
            "ingredient_name": " "
        }
        results.append(EcodesResponse.model_validate(default_data))

    return results

def check_halal(data, session: SessionDep):
    
    # Clean and prepare ingredients list
    # ingredients_tags = extract_json_list_values(data, ["product", "_keywords"])
    ingredients_tags = extract_json_list_values(data, ["product", "ingredients_original_tags"])

    
    # halal_keywords = [
    #     "vegan","halal-certified", "halal"
    # ]  
    additives_tags = extract_json_list_values(data, ["product", "additives_original_tags"])
    additives_tags = clean_data(additives_tags)
    additives = process_Ecodes(additives_tags, session)
    
    nutriments = extract_json_list_values(data, ["product", "nutriments"])

    # Prepare result
    result = {
        "halal_status": "halal",
        "additives": additives,
        "nutriments":nutriments,
        "total_ingredients_checked": len(ingredients_tags)
    }

    # Match = find_matching_items(ingredients_tags, halal_keywords)
    # if Match:
    #     return result
    
    return result

def check_haram(data, session: SessionDep):
    
    # Clean and prepare ingredients list
    ingredients_tags = extract_json_list_values(data, ["product", "ingredients_original_tags"])
    ingredients_tags = clean_data(ingredients_tags)
    
    # Get haram lists from database
    haram_ingredients_list = extract_column_values("ingredient_name", get_haram_ingredients(session))
    haram_ecodes_list = extract_column_values("ecode", get_haram_ecodes(session))
    
    Match = find_matching_items(ingredients_tags, haram_ingredients_list, haram_ecodes_list)


    keywords_tags = extract_json_list_values(data, ["product", "_keywords"])

    keywords_haram = [
        "alcohol", "alcoholic", "alcoholica",
        "pork", "pig", "swine",
        "wine", "beer", "liquor",
        "grape wine", "pig meat",
    ]
    
    Match2 = find_matching_items(keywords_tags, keywords_haram)

    ingredients_found = Match + Match2

    ingredients_checked = len(ingredients_tags) + len(keywords_tags)

    why = process_why(ingredients_found, session)

    additives_tags = extract_json_list_values(data, ["product", "additives_original_tags"])
    additives_tags = clean_data(additives_tags)
    additives = process_Ecodes(additives_tags, session)

    nutriments = extract_json_list_values(data, ["product", "nutriments"])

    # Prepare result
    result = {
        "halal_status": "haram",
        "why": why,
        "additives": additives,
        "nutriments": nutriments,
        "total_ingredients_checked": ingredients_checked
    }
    
    if Match or Match2:
        return result
    
    return None

def check_unknown(data, session: SessionDep ):
    
    # Clean and prepare ingredients list
    ingredients_tags = extract_json_list_values(data, ["product", "ingredients_original_tags"])
    ingredients_tags = clean_data(ingredients_tags)

    
    # Get unknown lists from database
    unknown_ingredients_list = extract_column_values("ingredient_name", get_unknown_ingredients(session))
    unknown_ecodes_list = extract_column_values("ecode", get_unknown_ecodes(session))


    Match = find_matching_items(ingredients_tags, unknown_ingredients_list, unknown_ecodes_list)

    why = process_why(Match, session) 

    additives_tags = extract_json_list_values(data, ["product", "additives_original_tags"])
    additives_tags = clean_data(additives_tags)
    additives = process_Ecodes(additives_tags, session)

    nutriments = extract_json_list_values(data, ["product", "nutriments"])

    # Prepare result
    result = {
        "halal_status": "unknown",
        "why": why,
        "additives": additives,
        "nutriments":nutriments,
        "total_ingredients_checked": len(ingredients_tags)
    }
    
    if Match:
        return result
    
    return None


def Not_found(data):

    ingredients_tags = extract_json_list_values(data, ["product", "ingredients_original_tags"])

    # Prepare result
    result = {
        "halal_status": "not found",
    }

    if len(ingredients_tags) == 0:
            return result
    
    return None


def check_all(data, session: SessionDep):
    halal_result = check_halal(data, session)
    haram_result = check_haram(data, session)
    unknown_result = check_unknown(data, session)
    Not_found_result = Not_found(data)
    
    if Not_found_result:
        return Not_found_result
    
    if haram_result:
        return haram_result
    
    if unknown_result:
        return unknown_result
    
    if halal_result:
        return halal_result
    
    ingredients_tags = extract_json_list_values(data, ["product", "ingredients_original_tags"])
    ingredients_tags = clean_data(ingredients_tags)


    # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found" )
    return {
        "halal_status": "not found",
    }
    


def get_from_openfoodfacts_offline(session: SessionDep):
    file_path = "./0850020783786.json"
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
    
async def get_from_openfoodfacts(barcode, session: SessionDep):
    try:
        # Step 1: Call external API
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://world.openfoodfacts.org/api/v3/product/{barcode}.json")
            
            
            # Step 2: Check for successful response
            if response.status_code == 404:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Product not found"
                )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="External API request failed"
                )
            
            # Step 3: Process the data
            external_data = response.json()

            analysis_result = check_all(external_data, session)

            processed_data = {
                **external_data,
                "processed": True,
                "halal_analysis": analysis_result
            }
            
            # Step 4: Return modified data
            return processed_data
            
    except httpx.RequestError as e:
        # Handle connection errors
        raise HTTPException(
            status_code=503,
            detail="Service unavailable: Could not connect to external API"
        )

