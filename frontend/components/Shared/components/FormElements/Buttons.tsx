import React from 'react';
import { Text,View, TouchableOpacity } from 'react-native';


const Buttons = () => {
    return (
        <View className="flex items-center justify-center mt-6 w-full px-8">
        <TouchableOpacity className="bg-green-400 rounded-full py-2 px-20 ">
          <Text className="text-white text-base">Button</Text>
        </TouchableOpacity>
      </View>
    )
};

export default Buttons;

