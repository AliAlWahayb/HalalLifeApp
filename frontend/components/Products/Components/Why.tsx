import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import Accordion from 'components/Shared/Accordion';
import { formatadditive } from 'util/productDataFormatters';

interface why {
  reason: string;
  name: string;
}

const Why = ({ product }: { product: any }) => {
  // Format Why for display
  const Why = useMemo(() => {
    if (!product.Why_tags?.length) return [];
    return product.Why_tags.map((why: string) => ({
      reason: why,
      name: formatadditive(why),
    }));
  }, [product.Why_tags]);

  return (
    <>
      {/* Why Accordion */}
      <Accordion key="Why" title="Why" number={String(Why.length)}>
        <View className="">
          {Why.length > 0 ? (
            Why.map((why: why, index: number) => (
              <View key={index} className="flex-row  border-b border-gray-300 ">
                <Text className="mr-4 text-base font-bold text-textPrimary">
                  {why.name.charAt(0).toUpperCase() + why.name.slice(1)}
                </Text>
                <Text className="flex-1 text-textPrimary" adjustsFontSizeToFit>
                  {why.reason.charAt(0).toUpperCase() + why.reason.slice(1)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-lg font-bold text-textPrimary">No why information available</Text>
          )}
        </View>
      </Accordion>
    </>
  );
};

export default Why;
