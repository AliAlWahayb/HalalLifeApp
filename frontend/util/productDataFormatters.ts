/**
 * Utility functions for formatting product data
 */

/**
 * Formats an Open Food Facts tag by removing the 'en:' prefix and capitalizing words
 * @param tag The tag to format (e.g., 'en:no-gluten')
 * @returns Formatted tag (e.g., 'No Gluten')
 */
export const formatTag = (tag: string): string => {
  return tag
    .replace('en:', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Maps of additives E-codes to their common names
 */
export const ADDITIVE_TRANSLATIONS: { [key: string]: string } = {
  'EN:E100': 'Curcumin (Turmeric)',
  'EN:E101': 'Riboflavin (Vitamin B2)',
  'EN:E102': 'Tartrazine',
  'EN:E104': 'Quinoline Yellow',
  'EN:E120': 'Cochineal (Carmine)',
  'EN:E122': 'Carmoisine',
  'EN:E129': 'Allura Red AC',
  'EN:E150A': 'Plain Caramel',
  'EN:E150B': 'Caustic Sulphite Caramel',
  'EN:E150C': 'Ammonia Caramel',
  'EN:E150D': 'Sulphite Ammonia Caramel',
  'EN:E160A': 'Alpha-carotene, Beta-carotene',
  'EN:E160B': 'Annatto, Bixin, Norbixin',
  'EN:E160C': 'Paprika Extract',
  'EN:E160D': 'Lycopene',
  'EN:E160E': 'Beta-apo-8′-carotenal',
  'EN:E160F': 'Ethyl ester of beta-apo-8′-carotenic acid',
  'EN:E161B': 'Lutein',
  'EN:E161G': 'Canthaxanthin',
  'EN:E162': 'Beetroot Red',
  'EN:E163': 'Anthocyanins',
  'EN:E170': 'Calcium Carbonate',
  'EN:E171': 'Titanium Dioxide',
  'EN:E172': 'Iron Oxides and Hydroxides',
  'EN:E200': 'Sorbic Acid',
  'EN:E202': 'Potassium Sorbate',
  'EN:E210': 'Benzoic Acid',
  'EN:E211': 'Sodium Benzoate',
  'EN:E212': 'Potassium Benzoate',
  'EN:E220': 'Sulphur Dioxide',
  'EN:E221': 'Sodium Sulphite',
  'EN:E222': 'Sodium Bisulphite',
  'EN:E223': 'Sodium Metabisulphite',
  'EN:E224': 'Potassium Metabisulphite',
  'EN:E250': 'Sodium Nitrite',
  'EN:E251': 'Sodium Nitrate',
  'EN:E252': 'Potassium Nitrate',
  'EN:E270': 'Lactic Acid',
  'EN:E296': 'Malic Acid',
  'EN:E300': 'Ascorbic Acid (Vitamin C)',
  'EN:E301': 'Sodium Ascorbate',
  'EN:E302': 'Calcium Ascorbate',
  'EN:E304': 'Fatty Acid Esters of Ascorbic Acid',
  'EN:E306': 'Tocopherol-rich Extract',
  'EN:E307': 'Alpha-tocopherol',
  'EN:E308': 'Gamma-tocopherol',
  'EN:E309': 'Delta-tocopherol',
  'EN:E310': 'Propyl Gallate',
  'EN:E315': 'Erythorbic Acid',
  'EN:E316': 'Sodium Erythorbate',
  'EN:E320': 'Butylated Hydroxyanisole (BHA)',
  'EN:E321': 'Butylated Hydroxytoluene (BHT)',
  'EN:E322': 'Lecithins',
  'EN:E325': 'Sodium Lactate',
  'EN:E326': 'Potassium Lactate',
  'EN:E327': 'Calcium Lactate',
  'EN:E330': 'Citric Acid',
  'EN:E331': 'Sodium Citrates',
  'EN:E332': 'Potassium Citrates',
  'EN:E333': 'Calcium Citrates',
  'EN:E334': 'Tartaric Acid',
  'EN:E335': 'Sodium Tartrates',
  'EN:E336': 'Potassium Tartrates',
  'EN:E337': 'Sodium Potassium Tartrate',
  'EN:E338': 'Phosphoric Acid',
  'EN:E339': 'Sodium Phosphates',
  'EN:E340': 'Potassium Phosphates',
  'EN:E341': 'Calcium Phosphates',
  'EN:E407': 'Carrageenan',
  'EN:E410': 'Locust Bean Gum',
  'EN:E412': 'Guar Gum',
  'EN:E413': 'Tragacanth',
  'EN:E414': 'Acacia Gum',
  'EN:E415': 'Xanthan Gum',
  'EN:E420': 'Sorbitol',
  'EN:E421': 'Mannitol',
  'EN:E422': 'Glycerol',
  'EN:E440': 'Pectin',
  'EN:E450': 'Diphosphates',
  'EN:E451': 'Triphosphates',
  'EN:E460': 'Cellulose',
  'EN:E461': 'Methyl Cellulose',
  'EN:E466': 'Carboxymethylcellulose',
  'EN:E471': 'Mono- and Diglycerides of Fatty Acids',
  'EN:E472E': 'Mono- and Diacetyltartaric Acid Esters of Mono- and Diglycerides of Fatty Acids',
  'EN:E500': 'Sodium Carbonates',
  'EN:E501': 'Potassium Carbonates',
  'EN:E503': 'Ammonium Carbonates',
  'EN:E504': 'Magnesium Carbonates',
  'EN:E507': 'Hydrochloric Acid',
  'EN:E508': 'Potassium Chloride',
  'EN:E509': 'Calcium Chloride',
  'EN:E511': 'Magnesium Chloride',
  'EN:E516': 'Calcium Sulphate',
  'EN:E524': 'Sodium Hydroxide',
  'EN:E551': 'Silicon Dioxide',
  'EN:E621': 'Monosodium Glutamate',
  'EN:E627': 'Disodium Guanylate',
  'EN:E631': 'Disodium Inosinate',
  'EN:E901': 'Beeswax',
  'EN:E903': 'Carnauba Wax',
  'EN:E950': 'Acesulfame K',
  'EN:E951': 'Aspartame',
  'EN:E953': 'Isomalt',
  'EN:E954': 'Saccharin',
  'EN:E955': 'Sucralose',
  'EN:E960': 'Steviol Glycosides',
  'EN:E965': 'Maltitol',
  'EN:E967': 'Xylitol',
  'EN:E1400': 'Dextrin',
  'EN:E1403': 'Bleached Starch',
  'EN:E1404': 'Oxidized Starch',
  'EN:E1410': 'Monostarch Phosphate',
  'EN:E1412': 'Distarch Phosphate',
  'EN:E1414': 'Acetylated Distarch Phosphate',
  'EN:E1420': 'Acetylated Starch',
  'EN:E1442': 'Hydroxypropyl Distarch Phosphate',
  'EN:E1450': 'Starch Sodium Octenyl Succinate',
};

/**
 * Formats an additive code to its common name
 * @param additive The additive code (e.g., 'en:e330')
 * @returns The common name of the additive (e.g., 'Citric Acid')
 */
export const formatAdditive = (additive: string): string => {
  const eCode = additive.toUpperCase();
  return ADDITIVE_TRANSLATIONS[eCode] || eCode.replace('EN:', '');
};

/**
 * Extracts the Nova group number from a Nova tag
 * @param novaTag The Nova tag (e.g., 'en:4-ultra-processed-food-and-drink-products')
 * @returns The Nova group number (e.g., '4')
 */
export const extractNovaGroup = (novaTag: string): string => {
  if (!novaTag) return 'N/A';
  const match = novaTag.match(/en:(\d+)-/);
  return match ? match[1] : 'N/A';
};

/**
 * Checks if a product has vegetarian or vegan warnings
 * @param tags The ingredients analysis tags array
 * @returns Object with boolean flags for vegan and vegetarian warnings
 */
export const getDietaryWarnings = (tags: string[]) => {
  return {
    veganWarning: tags.includes('en:vegan-status-unknown'),
    vegetarianWarning: tags.includes('en:vegetarian-status-unknown'),
    palmOilWarning: tags.includes('en:palm-oil-content-unknown'),
  };
};
