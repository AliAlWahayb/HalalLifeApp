import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import Accordion from 'components/Shared/Accordion';
import { formatAdditive } from 'util/productDataFormatters';

interface additive {
  name: string;
  ingredient_name: string | null;
}

const Additives = ({ product }: { product: any }) => {
  const additives = useMemo(() => {
    return product || [];
  }, [product]);

  return (
    <>
      {/* Additives Accordion */}
      <Accordion key="additives" title="Additives" number={String(additives.length)}>
        <View className="">
          {additives.length > 0 ? (
            additives.map((additive: additive, index: number) => (
              <View key={index} className="flex-row  border-b border-gray-300 ">
                <Text className="mr-4 text-base font-bold text-textPrimary">
                  {additive.name && typeof additive.name === 'string'
                    ? additive.name.charAt(0).toUpperCase() + additive.name.slice(1)
                    : ''}
                </Text>
                <Text className="flex-1 text-textPrimary" adjustsFontSizeToFit>
                  {additive.ingredient_name && typeof additive.ingredient_name === 'string'
                    ? additive.ingredient_name.charAt(0).toUpperCase() +
                      additive.ingredient_name.slice(1)
                    : 'No description available'}
                </Text>
              </View>
            ))
          ) : (
            <Text>No additives information available</Text>
          )}
        </View>
      </Accordion>
    </>
  );
};

export default Additives;
