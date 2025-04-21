import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const CarouselContainer = ({
  baseData,
  onPress,
}: {
  baseData: { item: { title: string; img: any }; index: number; dataIndex: number };
  onPress: () => void;
}) => {
  const handlePress = () => {
    onPress();
  };

  // Extract the item data from baseData
  const { item } = baseData;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className=" mx-1 flex w-fit items-center justify-center rounded-2xl p-4">
      <Image
        source={item.img}
        placeholder={{ blurhash }}
        contentFit="contain"
        alt={item.title}
        style={{ width: '100%', height: '100%', aspectRatio: 1.8 }}
      />
    </TouchableOpacity>
  );
};

export default CarouselContainer;
