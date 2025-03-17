/* eslint-disable import/order */
import { View, Text } from 'react-native';
import React from 'react';

interface Props {
  size: number;
  color: string[];
}

const Colors = ({ size, color }: Props) => {
  return (
    <View className="flex-row  border-2 border-black ">
      <View className={` size-${size} bg-${color[0]}`} />
      <View className={` size-${size} bg-${color[1]}`} />
      <View className={` size-${size} bg-${color[2]}`} />
    </View>
  );
};

export default Colors;
