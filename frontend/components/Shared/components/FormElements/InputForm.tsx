import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

const InputForm = ({ label, placeholder, secureTextEntry }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-4 text-center text-gray-600">{label}</Text>

      <TextInput
        className={`w-3/4 rounded-lg border bg-white px-16 py-3 ${isFocused ? 'border-green-200' : 'border-gray-300'}`}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

export default InputForm;
