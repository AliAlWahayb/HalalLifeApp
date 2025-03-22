import { Text, View } from 'react-native';
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../../../util/Validators';
import InputForm from '../../Shared/FormElements/InputForm';
import Buttons from '../../Shared/Buttons/Buttons';
import Header from '../components/Header';
import React, { useState, useContext } from 'react';
import { useForm } from '../../../hooks/form-hooks';
import { AuthContext } from '../../../context/Auth-context';

const ForgetPass = () => {
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false,
    },
  });

  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    console.log('Password reset request sent.', formState.inputs.email.value);
    auth.login();
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Header />
      <Text className="text-accent m-2 mr-12 text-4xl font-bold">Resset Password</Text>
      <Text className="mr-20 text-sm font-bold text-gray-400">
        please enter your email address to
      </Text>
      <Text className="mr-44 text-sm font-bold text-gray-400">request a E-mail rest</Text>

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
