import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/Auth-context';
import { useForm } from 'hooks/form-hooks';
import React, { useContext } from 'react';
import { Text, View, Alert } from 'react-native';
import { VALIDATOR_EMAIL } from 'util/Validators';

import Buttons from '../../Shared/components/FormElements/Buttons';
import InputForm from '../../Shared/components/FormElements/InputForm';
import Header from '../components/Header';
import { API_BASE } from 'hooks/useProduct';

const ForgetPass = () => {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async () => {
    if (!formState.isValid) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.', [{ text: 'OK' }]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.inputs.email.value,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.detail || 'Something went wrong!');
      }

     
      navigation.navigate('VerifyCom3', {
        email: formState.inputs.email.value,
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong!');
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-8 bg-white">
      <Header />
      <Text className="text-[#77C273] font-bold text-4xl m-2 mr-14">Reset Password</Text>
      <Text className="text-gray-400 font-bold text-sm mr-24">
        Please enter your email address to request a password reset
      </Text>

      <View className="w-full items-center">
        <InputForm
          element="input"
          id="email"
          type="email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
      </View>

      <View className="flex-col items-center mt-4 w-full">
        <Buttons onPress={authSubmitHandler}>Send OTP Code</Buttons>
      </View>
    </View>
  );
};

export default ForgetPass;
