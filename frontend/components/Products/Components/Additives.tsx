import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import Accordion from 'components/Shared/Accordion';
import { formatAdditive } from 'util/productDataFormatters';

interface additive {
  code: string;
  name: string;
}

const Additives = ({ product }: { product: any }) => {
  // Format additives for display
  const additives = useMemo(() => {
    if (!product.additives_tags?.length) return [];
    return product.additives_tags.map((additive: string) => ({
      code: additive,
      name: formatAdditive(additive),
    }));
  }, [product.additives_tags]);

  return (
    <>
      {/* Additives Accordion */}
      <Accordion key="additives" title="Additives" number={String(additives.length)}>
        <View className="">
          {additives.length > 0 ? (
            additives.map((additive: additive, index: number) => (
              <View key={index} className="flex-row justify-between border-b border-gray-200 py-1">
                <Text className="font-bold">{additive.code.replace('en:', '').toUpperCase()}</Text>
                <Text>{additive.name}</Text>
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
