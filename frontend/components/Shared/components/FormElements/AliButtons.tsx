import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  icon?: JSX.Element;
  onPress: () => void;
}

const Buttons = ({ title, icon, onPress }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex h-12 w-5/12 items-center justify-center rounded-full bg-[#77C273]"
      onPress={handlePress}>
      <View className="flex h-full w-full flex-row items-center justify-center gap-2 ">
        {icon && icon}
        <Text className="text-center text-2xl font-semibold text-white">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Buttons;
