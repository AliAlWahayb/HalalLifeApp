import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Buttons = ({ title, onPress }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    onPress();
  };

  return (
    <View className="mt-6 flex w-full items-center justify-center px-8">
      <TouchableOpacity className="rounded-full bg-green-500 px-20 py-2" onPress={handlePress}>
        <Text className="text-base text-white">{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Buttons;
