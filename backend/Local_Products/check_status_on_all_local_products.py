import pandas as pd
from tqdm import tqdm  # For progress bar

# Initialize tqdm for pandas
tqdm.pandas()

# Load data
full_df = pd.read_csv('random_filtered_rows.csv', sep='\t')  # Replace with your actual filename
ingredient_df = pd.read_csv('ingredient.csv')
ecode_df = pd.read_csv('ecodes.csv')

# Create status mapping dictionary
status_map = {1: 'halal', 2: 'haram', 3: 'unknown', 4: 'unknown'}

def get_ingredient_status(ingredient_tag):
    """Check ingredient against both tables and return status and source"""
    # Clean the ingredient tag
    clean_tag = ingredient_tag.replace('en:', '').strip().lower()
    
    # Check in ingredient table
    ingredient_match = ingredient_df[
        (ingredient_df['ingredient_name'].str.lower() == clean_tag) |
        (ingredient_df['ecode'].str.lower() == clean_tag)
    ]
    
    if not ingredient_match.empty:
        status = status_map.get(ingredient_match.iloc[0]['id_status'], 'unknown')
        return status, 'ingredient_table'
    
    # Check in ecode table
    ecode_match = ecode_df[
        (ecode_df['ingredient_name'].str.lower() == clean_tag) |
        (ecode_df['ecode'].str.lower() == clean_tag)
    ]
    
    if not ecode_match.empty:
        status = status_map.get(ecode_match.iloc[0]['id_status'], 'unknown')
        return status, 'ecode_table'
    
    return 'unknown', 'not_found'

def analyze_product(row):
    if pd.isna(row['ingredients_tags']):
        return pd.Series(['unknown', 'No ingredients listed'])
    
    try:
        ingredients = row['ingredients_tags'].split(',')
    except AttributeError:
        return pd.Series(['unknown', 'Invalid ingredients format'])
    
    statuses = []
    details = []
    
    for ing in ingredients:
        if pd.isna(ing):
            continue
        status, source = get_ingredient_status(ing)
        statuses.append(status)
        details.append(f"{ing}: {status} ({source})")
    
    if not statuses:
        return pd.Series(['unknown', 'No valid ingredients found'])
    
    if 'haram' in statuses:
        overall_status = 'haram'
    elif 'unknown' in statuses:
        overall_status = 'unknown'
    else:
        overall_status = 'halal'
    
    return pd.Series([overall_status, '\n'.join(details)])

# Process all products with progress bar
print("Analyzing products...")
full_df[['halal_status', 'ingredient_analysis']] = full_df.progress_apply(analyze_product, axis=1)

# Save results
full_df.to_csv('all_products_with_halal_status.csv', index=False)

print("\nAnalysis complete. Results saved to all_products_with_halal_status.csv")
print("Sample output:")
print(full_df[['product_name', 'halal_status', 'ingredient_analysis']].head().to_string(index=False))