import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Accordion from 'components/Shared/Accordion';
import { useTheme } from 'themes/ThemeProvider';

const Ingredients = ({ product }: { product: any }) => {
  const { theme } = useTheme();
  // Recursive ingredient formatter
  type Ingredient = {
    id: string;
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
            name: item.id.split(':')[1],
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

  return (
    <>
      {/* Ingredients Accordion */}
      <Accordion
        key="Ingredients"
        title="Ingredients"
        number={String(ingredients.filter((ing) => !ing.hasNested).length)}>
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
                  {ingredient.name.replace(/-/g, ' ').charAt(0).toUpperCase() +
                    ingredient.name.replace(/-/g, ' ').slice(1)}
                </Text>

                <Text
                  className={`${
                    ingredient.depth === 0
                      ? 'text-lg font-bold text-textPrimary'
                      : ingredient.depth === 1
                        ? 'text-base font-normal text-textPrimary'
                        : 'text-base font-thin text-textPrimary'
                  } ${ingredient.hasNested ? 'underline' : ''}`}>
                  {ingredient.estimation}
                </Text>
              </View>
            ))
          ) : (
            <View className="flex-row items-center justify-center py-3">
              <FontAwesome name="exclamation-triangle" size={16} color={theme.colors.textMuted} />
              <Text className="text-warning ml-2">No ingredient information available</Text>
            </View>
          )}
        </View>
      </Accordion>
    </>
  );
};

export default Ingredients;
