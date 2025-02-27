import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Buttons = ({ title, onPress }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex h-5 items-center justify-center rounded-full bg-[#77C273] p-2"
      onPress={handlePress}>
      <Text className="text-center text-sm font-medium text-white">{title}</Text>
    </TouchableOpacity>
  );
};

export default Buttons;
