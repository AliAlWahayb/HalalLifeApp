import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

const InputForm = ({ label, placeholder, secureTextEntry }) => {
  
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">

      <Text className="text-gray-600 mb-4 text-center">{label}</Text>

      <TextInput className={`border rounded-lg px-16 py-3 bg-white w-3/4 ${isFocused ? 'border-green-200' : 'border-gray-300'}`}
      
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}   
        onBlur={() => setIsFocused(false)}   
      />
    </View>
  );
}

export default InputForm;
