import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import { Image } from 'expo-image';

const Hero = ({ product }: { product: any }) => {
  // Get the front image URL
  const frontImageUrl = useMemo(() => {
    return product.selected_images?.front?.display?.en || null;
  }, [product.selected_images]);

  // Define the blurhash value for image placeholder
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <>
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
          className="flex-wrap pt-2 text-center text-2xl font-bold text-textPrimary"
          adjustsFontSizeToFit>
          {product.product_name_en}
        </Text>
      </View>
    </>
  );
};

export default Hero;
