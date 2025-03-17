/* eslint-disable import/order */
import { View, TouchableOpacity } from 'react-native';
import React from 'react';

interface Props {
  size: number;
  color: string[];
  id: string;
}

const Colors = ({ size, color, id }: Props) => {
  const HandleChange = () => {
    console.log(id);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={HandleChange}
      className="flex-row  border-2 border-black ">
      <View className={` size-${size} bg-${color[0]}`} />
      <View className={` size-${size} bg-${color[1]}`} />
      <View className={` size-${size} bg-${color[2]}`} />
    </TouchableOpacity>
  );
};

export default Colors;
