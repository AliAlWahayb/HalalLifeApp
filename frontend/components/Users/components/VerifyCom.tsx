import React, { useRef, useState,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/Auth-context';
import axios from 'axios'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE } from 'hooks/useProduct';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';


const VerifyCom = () => {
  const inputRefs = useRef([]);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { confirmResult, phoneNumber } = route.params;

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
      handleVerify(finalCode);
    }
  };
  const auth = useContext(AuthContext);
  const handleVerify = async (finalCode) => {
    try {
      const result = await confirmResult.confirm(finalCode);
      const user = result.user;


      auth.login(user.uid, 'phone-token','phone');
      console.log(" Verification Done ✅");

      await axios.post(`${API_BASE}/phone-auth`, {
        //this is my device ip you must replace with your device ip
        uid: user.uid,
        phone_number: user.phoneNumber,
        created_at: new Date().toISOString(),
      });

      Alert.alert('Success', `Welcome ${user.phoneNumber}`);
      navigation.navigate('Navigation');
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Verification failed or network error');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };
  // Please enter the code sent to {phoneNumber}
  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="text-3xl font-bold text-[#77C273]">Verification Code</Text>
      <Text className="my-2 text-center text-sm font-bold text-gray-400">
        Please enter the code sent to your phone number
      </Text>

      <View className="mb-4 flex-row justify-center space-x-2">
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
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
        ))}
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Resending...')}>
        <Text className="text-sm font-bold text-gray-400">
          Didn’t receive a code? <Text className="text-sm font-bold text-[#77C273]">Resend</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyCom;
