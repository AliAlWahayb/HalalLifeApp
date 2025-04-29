import { Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber } from 'firebase/auth';

import Buttons from '../../Shared/components/FormElements/Buttons';
import Header from '../components/Header';
import InputForm from 'components/Shared/components/FormElements/InputForm';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_MAXLENGTH, VALIDATOR_PHONE } from 'util/Validators';
import { auth, firebaseConfig } from '../../firebase/firebase-config';
import { useForm } from 'hooks/form-hooks';
import { AuthContext } from '../../context/Auth-context'

const Registration = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const recaptchaVerifier = useRef(null);

  const [formState, inputHandler] = useForm(
    {
      numeric: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const sendOtp = async () => {
    const phoneNumber = '+15555551234';

    if (!formState.isValid) {
      console.log('Invalid Number');
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      navigation.navigate('VerfyCode', {
        confirmResult: confirmation,
        phoneNumber: phoneNumber,
      });
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      {/* ✅ مودال reCAPTCHA */}
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />

      <Header />
      <Text className="text-3xl font-bold text-[#77C273] mb-2">Registrations</Text>
      <Text className="text-sm font-bold text-gray-400 text-center mb-4">
        Enter your phone number to verify your account
      </Text>

      <InputForm
        element="input"
        id="numeric"
        type="int"
        validators={[
          VALIDATOR_REQUIRE(),
          VALIDATOR_MINLENGTH(9),
          VALIDATOR_MAXLENGTH(12),
          VALIDATOR_PHONE(),
        ]}
        errorText="Please enter a valid phone number (9-12 digits)."
        onInput={inputHandler}
      />

      <View className="mt-4 w-full flex-col items-center">
        <Buttons onPress={sendOtp}>Send</Buttons>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Auth', { isLogin: false })}>
        <Text className="text-gry-300 m-4">
          Sign up in your <Text className="font-bold text-[#77C273]">E-mail</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;
