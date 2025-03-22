import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

const dynamicFontSize = (text: string) => {
  const length = text.length;
  if (length < 8) {
    return 'text-xl'; // Large font for short text
  } else if (length >= 8 && length < 21) {
    return 'text-md'; // Medium font for medium-length text
  } else {
    return 'text-sm'; // Smaller font for long text
  }
};

const statusColor = (status: string) => {
  if (status === 'Halal') return '#77C273';
  if (status === 'Haram') return '#F76666';
  if (status === 'Unknown') return '#F7B766';
  return '#6B7280';
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Card = ({
  Name,
  img,
  Source,
  Status,
}: {
  Name: string;
  img: string;
  Source: string;
  Status: string;
}) => {
  const handlePress = () => {
    console.log(Name);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="m-3 flex flex-row rounded-2xl bg-white p-4 shadow-2xl shadow-black">
      <View className="flex min-w-[50%] flex-col gap-2 p-2">
        <Text className={`text-black ${dynamicFontSize(Name)} text-wrap`}>{Name}</Text>
        <Text className={`text-gray-500 ${dynamicFontSize(Source)} text-wrap`}>{Source}</Text>
        <View
          style={{ backgroundColor: statusColor(Status), height: 40, width: '66%' }}
          className=" items-center justify-center rounded-2xl">
          <Text className="text-lg font-semibold text-white">{Status}</Text>
        </View>
      </View>
      <View className="items-center justify-center rounded-xl px-2">
        <Image
          source={img}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={1000}
          style={{
            width: '100%',
            height: 60,
            aspectRatio: 2,
          }}
          alt={Name}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Card;
