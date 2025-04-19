import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Buttons = (props) => {
  const handlePress = () => {
    if (props.href) {
    } else if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity className="bg-accent mt-4 rounded-full  px-24 py-4" onPress={handlePress}>
      <Text className="text-textSecondary font-bold">{props.children}</Text>
    </TouchableOpacity>
  );
};

export default Buttons;
