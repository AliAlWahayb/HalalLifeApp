import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const Buttons = ({ title: any, icon }) => {
  return (
    <TouchableOpacity className="bg-green-400 rounded-full py-2 px-20 ">
      <Text className="text-white text-base">{title}</Text>
    </TouchableOpacity>
  );
};

export default Buttons;
