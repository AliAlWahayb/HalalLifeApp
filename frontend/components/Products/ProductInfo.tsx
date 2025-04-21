import FontAwesome from '@expo/vector-icons/FontAwesome';
import Accordion from 'components/Shared/Accordion';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import {
  formatTag,
  formatAdditive,
  extractNovaGroup,
  getDietaryWarnings,
} from 'util/productDataFormatters';

import ProductButtons from './Components/ProductButtons';

// Interfaces
interface ProductData {
  code: string;
  product: {
    countries: string;
    origins: string;
    generic_name: string;
    product_name_en: string;
    brands: string;
    brands_tags: string[];
    quantity: string;
    allergens_hierarchy: string[];
    allergens_tags: string[];
    labels_tags: string[];
    additives_tags: string[];
    nutriments: {
      [key: string]: number | string;
    };
    selected_images: {
      front: {
        display: { [key: string]: string };
        small: { [key: string]: string };
        thumb: { [key: string]: string };
      };
    };
    nutriscore_grade: string;
    nova_groups_tags: string[];
    ingredients_analysis_tags: string[];
    ingredients: {
      text: string;
      percent_estimate?: number;
      ingredients?: {
        text: string;
        percent_estimate?: number;
      }[];
    }[];
  };
}

// Helper component for nutrition row
const NutritionRow = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) => (
  <View className="flex-row justify-between border-b border-gray-200 py-1">
    <Text className="text-base font-medium text-textPrimary">{label}</Text>
    <Text className="text-base text-textPrimary">
      {value} {unit}
    </Text>
  </View>
);

// Helper component for details row
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <View className="flex-row justify-between py-1">
    <Text className="font-bold text-textPrimary">{label}:</Text>
    <View className="ml-2 flex-1 items-end">
      {typeof value === 'string' ? (
        <Text className="text-right text-textPrimary">{value}</Text>
      ) : (
        value
      )}
    </View>
  </View>
);

const ProductInfo: React.FC<{ productData: ProductData }> = ({ productData }) => {
  const { theme } = useTheme();
  const { product } = productData;

  // Memoize the font size calculation to avoid unnecessary recalculations
  const titleFontSize = useMemo(() => {
    const textLength = product.product_name_en.length;
    if (textLength < 20) return 'text-3xl'; // Larger font for short text
    if (textLength < 40) return 'text-2xl'; // Medium font for medium-length text
    return 'text-xl'; // Smaller font for long text
  }, [product.product_name_en]);

  const nutriscore_grade_Color = useMemo(() => {
    if (product.nutriscore_grade.toUpperCase() === 'A') return 'bg-green-500';
    if (product.nutriscore_grade.toUpperCase() === 'B') return 'bg-yellow-500';
    if (product.nutriscore_grade.toUpperCase() === 'C') return 'bg-orange-500';
    if (product.nutriscore_grade.toUpperCase() === 'D') return 'bg-red-500';
    return 'text-gray-500';
  }, [product.nutriscore_grade]);

  const novaGroup_Color = useMemo(() => {
    const novaGroup = extractNovaGroup(product.nova_groups_tags[0]);
    if (novaGroup === '4') return 'bg-red-500';
    if (novaGroup === '3') return 'bg-orange-500';
    if (novaGroup === '2') return 'bg-yellow-500';
    if (novaGroup === '1') return 'bg-green-500';
    return 'bg-gray-500';
  }, [product.nova_groups_tags]);

  // Format allergens for display
  const allergens = useMemo(() => {
    if (!product.allergens_hierarchy?.length) return 'None';
    return product.allergens_hierarchy.map(formatTag).join(', ');
  }, [product.allergens_hierarchy]);

  // Format additives for display
  const additives = useMemo(() => {
    if (!product.additives_tags?.length) return [];
    return product.additives_tags.map((additive) => ({
      code: additive,
      name: formatAdditive(additive),
    }));
  }, [product.additives_tags]);

  // Recursive ingredient formatter
  type Ingredient = {
    text: string;
    percent_estimate?: number;
    ingredients?: Ingredient[];
  };

  const ingredients = useMemo(() => {
    const flattenIngredients = (
      items: Ingredient[],
      depth = 0,
      parentHasChildren = false
    ): {
      name: string;
      estimation: string;
      depth: number;
      hasNested: boolean;
      isChildOfParent: boolean;
    }[] => {
      return items.reduce(
        (acc, item) => {
          const hasNested = !!item.ingredients?.length;

          acc.push({
            name: item.text,
            estimation: item.percent_estimate
              ? `${Math.round(item.percent_estimate * 100) / 100}%`
              : 'Unknown%',
            depth,
            hasNested,
            isChildOfParent: parentHasChildren,
          });

          if (hasNested) {
            acc.push(...flattenIngredients(item.ingredients ?? [], depth + 1, true));
          }

          return acc;
        },
        [] as {
          name: string;
          estimation: string;
          depth: number;
          hasNested: boolean;
          isChildOfParent: boolean;
        }[]
      );
    };

    return product.ingredients ? flattenIngredients(product.ingredients) : [];
  }, [product.ingredients]);

  // Recursive nutrient formatter
  const nutrients = useMemo(() => {
    const formatNutrients = (
      nutriments: Record<string, any>
    ): {
      name: string;
      value: string;
      unit: string;
    }[] => {
      return Object.entries(nutriments)
        .filter(
          ([key]) => key.endsWith('_serving') && nutriments[`${key.replace('_serving', '_unit')}`]
        )
        .map(([key, value]) => {
          const unitKey = `${key.replace('_serving', '_unit')}`;
          return {
            name: key.replace('_serving', ''),
            value: `${value}`,
            unit: nutriments[unitKey],
          };
        });
    };

    return product.nutriments ? formatNutrients(product.nutriments) : [];
  }, [product.nutriments]);

  // Format labels for display
  const labels = useMemo(() => {
    if (!product.labels_tags?.length) return 'None';
    return product.labels_tags.map(formatTag).join(', ');
  }, [product.labels_tags]);

  // Get dietary warnings
  const { veganWarning, vegetarianWarning, palmOilWarning } = useMemo(() => {
    return getDietaryWarnings(product.ingredients_analysis_tags || []);
  }, [product.ingredients_analysis_tags]);

  // Get Nova group
  const novaGroup = useMemo(() => {
    if (!product.nova_groups_tags?.length) return 'N/A';
    return extractNovaGroup(product.nova_groups_tags[0]);
  }, [product.nova_groups_tags]);

  // Get the front image URL
  const frontImageUrl = useMemo(() => {
    return product.selected_images?.front?.display?.en || null;
  }, [product.selected_images]);

  // Define the blurhash value for image placeholder
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <ScrollView className="flex-1 bg-background py-5" contentContainerClassName="items-center">
      <View className="w-5/6 flex-col items-center justify-center rounded-3xl border-4 border-accent p-3">
        <View className="rounded-full bg-accent p-2">
          <FontAwesome name="check" size={48} color={theme.colors.textSecondary} />
        </View>
        <Text className="text-3xl font-bold text-accent">Halal</Text>
      </View>
      <View className="w-5/6 py-2">
        <View className="flex flex-col items-center">
          {frontImageUrl ? (
            <View className="">
              <Image
                source={{ uri: frontImageUrl }}
                placeholder={{ blurhash }}
                contentFit="contain"
                style={{ width: '100%', height: 150, aspectRatio: 1.5 }}
                alt="product image"
              />
            </View>
          ) : (
            <View className="h-[150px] w-1/2 items-center justify-center bg-gray-200">
              <Text>No image available</Text>
            </View>
          )}
          <Text
            className={`${titleFontSize} flex-wrap pt-2 text-center font-bold text-textPrimary`}>
            {product.product_name_en}
          </Text>
        </View>
        <View className="flex flex-col py-5">
          {/* Details Accordion */}
          <Accordion key="details" title="Details">
            <View className="">
              <DetailRow label="Common name" value={product.generic_name} />
              <DetailRow label="Brand" value={product.brands} />
              <DetailRow label="Quantity" value={product.quantity} />
              <DetailRow label="Allergens" value={allergens} />
              <DetailRow label="Labels" value={labels} />
              <DetailRow label="Origin" value={product.origins} />
              <DetailRow label="Sold in" value={product.countries} />
              <DetailRow
                label="Nutri-Score"
                value={
                  <View className={`rounded-full ${nutriscore_grade_Color} px-2 py-1`}>
                    <Text className="font-bold uppercase text-textSecondary">
                      {product.nutriscore_grade || 'N/A'}
                    </Text>
                  </View>
                }
              />
              <DetailRow
                label="Nova-Score"
                value={
                  <View className={`rounded-full ${novaGroup_Color} px-2 py-1`}>
                    <Text className="font-bold uppercase text-textSecondary">
                      {novaGroup || 'N/A'}
                    </Text>
                  </View>
                }
              />

              {/* Warning badges */}
              <View className="mt-1">
                {veganWarning && (
                  <View className=" rounded-xl bg-yellow-100 px-3 py-1">
                    <Text className="text-yellow-800">
                      Warning: Vegan status could not be verified for all ingredients
                    </Text>
                  </View>
                )}

                {vegetarianWarning && (
                  <View className=" rounded-xl bg-yellow-100 px-3 py-1">
                    <Text className="text-yellow-800">
                      Warning: Vegetarian status could not be verified for all ingredients
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Accordion>

          {/* Ingredients Accordion */}
          <Accordion
            key="Ingredients"
            title="Ingredients"
            number={ingredients.filter((ing) => !ing.hasNested).length}>
            <View className="">
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <View
                    key={`${index}-${ingredient.depth}`}
                    className={`flex-row items-center justify-between py-2 
                      ${ingredient.depth === 0 ? 'bg-muted/10 mb-2 rounded-lg px-3' : ''}
                      ${ingredient.depth >= 1 ? 'border-b border-gray-300' : ''}`}
                    style={{ paddingLeft: ingredient.depth * 16 }}>
                    <Text
                      className={`flex-1 ${
                        ingredient.depth === 0
                          ? 'text-lg font-bold text-textPrimary'
                          : ingredient.depth === 1
                            ? 'text-base font-normal text-textPrimary'
                            : 'text-sm font-thin text-textPrimary'
                      }`}>
                      {ingredient.name}
                    </Text>
                    {ingredient.isChildOfParent && !ingredient.hasNested && (
                      <Text
                        className={`${
                          ingredient.depth === 0
                            ? 'text-lg font-bold text-textPrimary'
                            : ingredient.depth === 1
                              ? 'text-base font-normal text-textPrimary'
                              : 'text-base font-thin text-textPrimary'
                        } `}>
                        {ingredient.estimation}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <View className="flex-row items-center justify-center py-3">
                  <FontAwesome
                    name="exclamation-triangle"
                    size={16}
                    color={theme.colors.textMuted}
                  />
                  <Text className="text-warning ml-2">No ingredient information available</Text>
                </View>
              )}
            </View>
          </Accordion>

          {/* Additives Accordion */}
          <Accordion key="additives" title="Additives" number={additives.length}>
            <View className="">
              {additives.length > 0 ? (
                additives.map((additive, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between border-b border-gray-200 py-1">
                    <Text className="font-bold">
                      {additive.code.replace('en:', '').toUpperCase()}
                    </Text>
                    <Text>{additive.name}</Text>
                  </View>
                ))
              ) : (
                <Text>No additives information available</Text>
              )}
            </View>
          </Accordion>

          {/* Nutritional Facts Accordion */}
          <Accordion key="nutrition" title="Nutritional Facts" number={nutrients.length}>
            <View className="">
              <Text className="mb-2 text-lg font-bold">Per Serving</Text>
              {nutrients
                .filter((nutrient) => nutrient.value !== '0')
                .sort((a, b) => {
                  const valueA = typeof a.value === 'string' ? parseFloat(a.value) : a.value;
                  const valueB = typeof b.value === 'string' ? parseFloat(b.value) : b.value;

                  const numA = Number.isNaN(valueA) ? -Infinity : valueA;
                  const numB = Number.isNaN(valueB) ? -Infinity : valueB;

                  return numB - numA;
                })
                .map((nutrient, index) => (
                  <NutritionRow
                    key={`${nutrient.name}-${index}`}
                    label={nutrient.name.charAt(0).toUpperCase() + nutrient.name.slice(1)}
                    value={nutrient.value}
                    unit={nutrient.name === 'energy' ? 'kj' : nutrient.unit}
                  />
                ))}
            </View>
          </Accordion>
        </View>
      </View>
      <ProductButtons />
    </ScrollView>
  );
};

export default ProductInfo;
