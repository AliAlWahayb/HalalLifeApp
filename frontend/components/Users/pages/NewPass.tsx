import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import InputForm from 'components/Shared/FormElements/InputForm';
import { useForm } from '../../../hooks/form-hooks';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/Validators'

const NewPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, otp } = route.params;

  const [formState, inputHandler] = useForm(
    {
      newPassword: {
        value: '',
        isValid: false,
      },
      confirmPassword: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const handleConfirm = async () => {
    const { newPassword, confirmPassword } = formState.inputs;

    if (!formState.isValid) {
      Alert.alert('Invalid Input', 'Please make sure all fields are valid.');
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2:8000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword.value,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.detail || 'Something went wrong!');
      }

      Alert.alert('Success', 'Password changed successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Auth'),
        },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-3xl font-bold text-[#77C273] mb-2">New Password</Text>
          <Text className="text-gray-400 font-bold text-sm mb-6">
            Enter a new password for your account
          </Text>

          <InputForm
            element="input"
            id="newPassword"
            type="password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid new password (min 8 chars)."
            onInput={inputHandler}
            placeholder="New Password"
            secureTextEntry={true}
            className="mb-4 rounded-lg border border-primary p-4"
          />

          <InputForm
            element="input"
            id="confirmPassword"
            type="password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
            errorText="Please confirm your password."
            onInput={inputHandler}
            placeholder="Confirm Password"
            secureTextEntry={true}
            className="mb-6 rounded-lg border border-primary p-4"
          />

          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-[#77C273] w-full py-3 rounded-lg items-center"
          >
            <Text className="text-white font-bold text-base">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewPassword;
