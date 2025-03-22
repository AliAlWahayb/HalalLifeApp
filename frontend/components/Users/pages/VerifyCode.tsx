import { Text, View } from 'react-native';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/Validators';
import InputForm from '../../Shared/FormElements/InputForm';
import Buttons from '../../Shared/Buttons/Buttons';
import Header from '../components/Header';
import React, { useState, useContext } from 'react';
import { useForm } from '../../../hooks/form-hooks';
import { AuthContext } from '../../../context/Auth-context';

const VerifyCode = () => {
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm({
    Number: {
      value: '',
      isValid: false,
    },
  });

  const authSubmitHandler = () => {
    if (!formState.isValid) {
      console.log('Invalid Code');
      return;
    }
    console.log(' ', formState.inputs.number.value);
    auth.login();
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Header />
      <Text className="m-2 ml-4 w-full text-4xl font-bold text-[#77C273]">Verification Code</Text>
      <Text className="mr-20 text-sm font-bold text-gray-400">
        please type the Verification Code send to your number{' '}
      </Text>

      <View className="w-full  items-center">
        <InputForm
          element="input"
          id="numeric"
          type="int"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(4)]}
          errorText="Please enter a valid Code "
          onInput={inputHandler}
        />
      </View>

      <View className="mt-4 w-full flex-col  items-center">
        <Text className="text-sm font-bold text-gray-400">
          I Dont’t recevie a code!{' '}
          <Text className="text-sm font-bold text-[#77C273]">Plaese resend</Text>
        </Text>
      </View>
    </View>
  );
};

export default VerifyCode;
