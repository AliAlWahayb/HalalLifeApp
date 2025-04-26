import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const VerifyCom3 = ({ onVerify }) => {
  const inputRefs = useRef([]);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChangeText = (text, index) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((num) => num !== '')) {
      const finalCode = newCode.join('');
      console.log('Verification Code:', finalCode);
      if (onVerify) onVerify(finalCode);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-3xl font-bold text-[#77C273]">Verification Code</Text>
        <Text className="text-sm font-bold text-gray-400 text-center my-2">
          Please enter the code sent to your email
        </Text>

        <View className="flex-row justify-center space-x-3 mt-4 mb-6">
          {code.map((num, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`m-4 h-14 w-12 rounded-lg border text-center text-2xl font-bold
             ${focusedIndex === index || code[index] !== '' ? 'border-green-500' : 'border-gray-300'}`}
              keyboardType="numeric"
              maxLength={1}
              value={num}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            />
          ))}
        </View>

        <TouchableOpacity onPress={() => console.log('Resending Code...')}>
          <Text className="text-sm font-bold text-gray-400">
            I didn’t receive a code?{' '}
            <Text className="text-sm font-bold text-[#77C273]">Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerifyCom3;
