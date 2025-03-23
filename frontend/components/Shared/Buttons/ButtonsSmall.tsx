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
      className="bg-accent flex items-center justify-center rounded-full p-2"
      onPress={handlePress}>
      <Text className="text-textSecondary text-center text-sm font-medium">{title}</Text>
    </TouchableOpacity>
  );
};

export default Buttons;
