import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity } from 'react-native';

const Buttons = ({title,onPress}) => {
const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    onPress();


  };

  return (
    <View className="flex items-center justify-center mt-6 w-full px-8">
      <TouchableOpacity
        className="bg-green-500 rounded-full py-2 px-20"
        onPress={handlePress} 
      >
          <Text className="text-white text-base">{title}</Text>
        
      </TouchableOpacity>
    </View>
  );
};

export default Buttons;

