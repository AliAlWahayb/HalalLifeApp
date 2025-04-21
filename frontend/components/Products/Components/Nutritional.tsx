import Accordion from 'components/Shared/Accordion';
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

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

const Nutritional = ({ product }: { product: any }) => {
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

  return (
    <>
      {/* Nutritional Facts Accordion */}
      <Accordion key="nutrition" title="Nutritional Facts" number={String(nutrients.length)}>
        <View className="">
          {nutrients.length > 0 ? (
            <View>
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
          ) : (
            <Text className="mb-2 text-lg font-bold">No nutritional facts available.</Text>
          )}
        </View>
      </Accordion>
    </>
  );
};

export default Nutritional;
