import Header from 'components/Users/components/Header';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const VerifyCom3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params; 

  const inputRefs = useRef([]);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChangeText = async (text, index) => {
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

      try {
        const response = await fetch('http://172.20.10.2:8000/api/users/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp: finalCode }),
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.detail || 'Something went wrong');
        }

     
        navigation.navigate('NewPassword', { email, otp: finalCode });

      } catch (err) {
        Alert.alert('Invalid Code', err.message || 'Please try again.');
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('http://172.20.10.2:8000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
  
      const resData = await response.json();
  
      if (!response.ok) {
        throw new Error(resData.detail || 'Failed to resend code');
      }
  
      Alert.alert('Success', 'A new verification code has been sent to your email.');
  
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong while resending the code.');
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-3xl font-bold text-[#77C273]">Verification Code</Text>
          <Text className="text-sm font-bold text-gray-400 text-center my-2">
            Please enter the code sent to your email
          </Text>

          <View className="flex-row justify-center space-x-3 mt-4 mb-6">
            {code.map((num, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className={`m-2 h-14 w-12 rounded-lg border text-center text-2xl font-bold
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

          <TouchableOpacity onPress={handleResend}>
            <Text className="text-sm font-bold text-gray-400">
              I didn’t receive a code?{' '}
              <Text className="text-sm font-bold text-[#77C273]">Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerifyCom3;
