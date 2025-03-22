import { Text, View } from 'react-native';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
} from '../../../util/Validators';
import InputForm from '../../Shared/FormElements/InputForm';
import Buttons from '../../Shared/Buttons/Buttons';
import Header from '../components/Header';
import React, { useState, useContext } from 'react';
import { useForm } from '../../../hooks/form-hooks';
import { AuthContext } from '../../../context/Auth-context';

const Registration = () => {
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm({
    Number: {
      value: '',
      isValid: false,
    },
  });

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
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(9), VALIDATOR_MAXLENGTH(12)]}
          errorText="Please enter a valid phone number (9-12 digits)."
          onInput={inputHandler}
        />
      </View>

      <View className="mt-4 w-full flex-col  items-center">
        <Buttons onPress={authSubmitHandler}>Send</Buttons>
      </View>
    </View>
  );
};

export default Registration;
