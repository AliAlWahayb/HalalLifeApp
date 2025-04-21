import { View, Text } from 'react-native';
import React from 'react';
import Accordion from 'components/Shared/Accordion';

const Nutritional = () => {
  return (
    <>
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
    </>
  );
};

export default Nutritional;
