import { View, Text } from 'react-native';
import React from 'react';

const dynamicFontSize = (text: string) => {
  const length = text.length;
  if (length < 8) {
    return 'text-xl';
  } else if (length >= 8 && length < 21) {
    return 'text-md';
  } else {
    return 'text-md';
  }
};

const statusColor = (status: string) => {
  if (status === 'Halal') return '#77C273';
  if (status === 'Haram') return '#F76666';
  if (status === 'Unknown') return '#F7B766';
  return '#6B7280';
};

const Card = ({ Name, Source, Status }: { Name: string; Source: string; Status: string }) => {
  return (
    <View className="m-3 max-w-lg flex-row justify-between rounded-2xl bg-white p-4 shadow-2xl shadow-black">
      <View className="flex flex-shrink flex-col px-2">
        <Text className={`text-black ${dynamicFontSize(Name)} text-wrap`}>{Name}</Text>
        <Text className={`text-gray-500 ${dynamicFontSize(Source)} text-wrap`}>{Source}</Text>
      </View>
      <View
        style={{ backgroundColor: statusColor(Status), height: 40 }}
        className="w-1/3 items-center justify-center rounded-2xl">
        <Text className="text-lg font-semibold text-white">{Status}</Text>
      </View>
    </View>
  );
};

export default Card;
