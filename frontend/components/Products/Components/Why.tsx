import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import Accordion from 'components/Shared/Accordion';

interface why {
  desc: string | null;
  name: string;
}

const Why = ({ product }: { product: why[] }) => {
  const whyData = useMemo(() => {
    return product || [];
  }, [product]);

  return (
    <>
      <Accordion key="Why" title="Why" number={String(whyData.length)}>
        <View className="">
          {whyData.length > 0 ? (
            whyData.map((why: why, index: number) => (
              <View key={index} className="flex-row  border-b border-gray-300 ">
                <Text className="mr-4 text-base font-bold text-textPrimary">
                  {why.name && typeof why.name === 'string'
                    ? why.name.charAt(0).toUpperCase() + why.name.slice(1)
                    : ''}
                </Text>
                <Text className="flex-1 text-textPrimary" adjustsFontSizeToFit>
                  {why.desc && typeof why.desc === 'string'
                    ? why.desc.charAt(0).toUpperCase() + why.desc.slice(1)
                    : 'No description available'}
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
