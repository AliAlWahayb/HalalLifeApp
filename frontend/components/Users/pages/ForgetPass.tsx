import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'context/Auth-context';
import { useForm } from 'hooks/form-hooks';
import React, { useState, useContext } from 'react';
import { Text, View, Alert } from 'react-native';
import { VALIDATOR_EMAIL } from 'util/Validators';

import Buttons from '../../Shared/components/FormElements/Buttons';
import InputForm from '../../Shared/components/FormElements/InputForm';
import Header from '../components/Header';

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
      const response = await fetch('http://172.20.10.2:8000/api/users/forgot-password', {
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
  
      Alert.alert('Password Reset', resData.message, [
        { text: 'OK', onPress: () => navigation.navigate('Auth' as never) },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Header />
      <Text className="m-2 mr-14 text-4xl font-bold text-[#77C273]">Resset Password</Text>
      <Text className="mr-24 text-sm font-bold text-gray-400">
        please enter your email address to request a Password rest
      </Text>

      <View className="w-full  items-center ">
        <InputForm
          element="input"
          id="email"
          type="email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
      </View>

      <View className="mt-4 w-full flex-col  items-center">
        <Buttons onPress={authSubmitHandler}>Send New Password</Buttons>
      </View>
    </View>
  );
};

export default ForgetPass;
