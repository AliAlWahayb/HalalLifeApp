#to get a specific column
from typing import Any, Dict, Iterable, List

from sqlmodel import SQLModel


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

# def extract_json_list_values(data: Dict[str, Any], json_key: str) -> List[str]:
#     value_list = data.get(json_key, [])

#     if not isinstance(value_list, list):
#         # print(f"Warning: Value for key '{json_key}' is not a list. Found type: {type(value_list)}")
#         return []

#     extracted_values: List[str] = []
#     for item in value_list:
#         if isinstance(item, str):
#             extracted_values.append(item.lower())
#         # else:
#             # Optionally handle non-string items if needed
#             # print(f"Warning: Skipping non-string item in list for key '{json_key}': {item}")

#     return extracted_values

from typing import Dict, Any, List

def extract_json_list_values(data: Dict[str, Any], path: List[str]) -> List[str]:
    current_level = data
    try:
        # Traverse the path except the last element
        for key in path[:-1]:
            current_level = current_level.get(key, {})
            if not isinstance(current_level, dict):
                return []

        # Get the final list from the last key
        final_list = current_level.get(path[-1], [])
        if not isinstance(final_list, list):
            return []

        # Extract and process string values
        return [item.lower() for item in final_list if isinstance(item, str)]
    
    except (KeyError, TypeError, AttributeError):
        return []
    
def clean_data(tags):

  cleaned_tags = []
  for tag in tags:
    # Remove 'en:' prefix if it exists
    if tag.startswith("en:"):
      cleaned_tag = tag[3:]
    else:
      cleaned_tag = tag

    # Replace underscores with spaces
    cleaned_tag = cleaned_tag.replace("-", " ")

    cleaned_tags.append(cleaned_tag)

  return cleaned_tags