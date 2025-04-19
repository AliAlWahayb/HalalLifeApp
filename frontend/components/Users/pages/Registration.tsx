import { Text, View, TouchableOpacity } from 'react-native';
import Buttons from '../../Shared/components/FormElements/Buttons';
import Header from '../components/Header';
import React, { useState, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import PhoneInputForm from '../components/PhoneInputForm';
import InputForm from 'components/Shared/components/FormElements/InputForm';
import { AuthContext } from 'context/Auth-context';
import { useForm } from 'hooks/form-hooks';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_MAXLENGTH , VALIDATOR_PHONE } from 'util/Validators';

const Registration = () => {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      Number: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = () => {
    if (!formState.isValid) {
      console.log('Invalid Number');
      return;
    }
    console.log('Number verification request sent for: ', formState.inputs.number.value);
    auth.login();
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Header />
      <Text className="m-2 mr-32 text-4xl font-bold text-[#77C273]">Registrations</Text>
      <Text className="mr-24 text-sm font-bold text-gray-400">
        Enter your phone number to verify your account
      </Text>

      <View className="w-full  items-center">
        <InputForm
          element="input"
          id="numeric"
          type="int"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(9), VALIDATOR_MAXLENGTH(12),VALIDATOR_PHONE()]}
          errorText="Please enter a valid phone number (9-12 digits)."
          onInput={inputHandler}
        />
      </View>

      <View className="mt-4 w-full flex-col  items-center">
        <Buttons onPress={() => navigation.navigate('VerfyCode' as never)}>Send</Buttons>
      </View>

      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Auth', { isLogin: false })}>
          <Text className="text-gry-300 m-4 ">
            Sign up in your <Text className="mr-4 font-bold text-[#77C273]  "> E-mail </Text>{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registration;
