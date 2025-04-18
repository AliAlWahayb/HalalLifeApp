import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Header from 'components/Users/components/Header';
import { AuthContext } from 'context/Auth-context';
import { useForm } from 'hooks/form-hooks';
import React, { useState, useContext , useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from 'util/Validators';
import FacebookImage from '../../../assets/Social/FacebookImge.png';
import GoogleImage from '../../../assets/Social/GoogleImge.png';
import Buttons from '../../Shared/components/FormElements/Buttons';
import InputForm from '../../Shared/components/FormElements/InputForm';



const Auth = () => {
  const navigation = useNavigation();
  type AuthRouteParams = {
    params?: {
      isLogin?: boolean;
    };
  };
  const route = useRoute<RouteProp<AuthRouteParams>>();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(route.params?.isLogin ?? true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async () => {
    const url = isLoginMode
      ? 'http://172.20.10.2:8000/api/users/login' //this is my device ip you must replace with your device ip
      : 'http://172.20.10.2:8000/api/users/signup';//this is my device ip you must replace with your device ip
  
    const body = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
      ...(isLoginMode ? {} : { name: formState.inputs.name.value }),
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const resData = await response.json();
  
      if (!response.ok) {
        throw new Error(resData.detail || 'Something went wrong!');
      }
  
      // إذا عندك نظام مصادقة، سجل المستخدم
      auth.login(resData.userId, resData.token);
      navigation.getParent()?.navigate('Navigation');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8 ">
      <Header />

      <Text className="mb-4 w-full text-3xl font-bold text-[#77C273]">
        {isLoginMode ? 'Log In' : 'Sign Up'}
      </Text>
      {!isLoginMode && (
        <InputForm
          label="Name"
          element="input"
          id="name"
          type="text"
          placeholder="Enter your Full Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a name."
          onInput={inputHandler}
        />
      )}

      <InputForm
        element="input"
        placeholder="Enter your Email"
        id="email"
        type="email"
        label="E-mail"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email address."
        onInput={inputHandler}
      />
      <InputForm
        element="input"
        id="password"
        type="password"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password, at least 8 characters."
        onInput={inputHandler}
        placeholder="Enter your password"
        secureTextEntry
      />

      {isLoginMode && (
        <TouchableOpacity>
          <Text
            onPress={() => navigation.navigate('ForgetPass' as never)}
            className="text-1xl  font-bold text-[#77C273] ">
            Forget password?
          </Text>
        </TouchableOpacity>
      )}

      <Buttons onPress={authSubmitHandler}>
        {isLoginMode ? 'Log In' : 'Sign Up'}
      </Buttons>

      <TouchableOpacity onPress={switchModeHandler}>
        <Text className="text-gry-300 mt-4">
          {' '}
          {isLoginMode ? 'Dont’t have an account?' : 'Already have an account? '}{' '}
          <Text className="font-bold text-[#77C273] ">{isLoginMode ? 'Sign Up' : 'Log In'}</Text>
        </Text>
      </TouchableOpacity>

      <View className="flex flex-col items-center ">
        <Text className="text-1xl pt-8 font-bold text-gray-400 ">Sign in with</Text>
      </View>

      <View className=" mt-4  flex-row">
        <TouchableOpacity
         className="flex flex-row items-center rounded-full bg-gray-100 px-6 py-4  ">
          <Image source={FacebookImage} className="mr-2 h-6 w-6" />
          <Text className="font-semibold text-black">Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
         className="ml-20 flex flex-row items-center rounded-full bg-gray-100 px-6 py-4">
          <Image source={GoogleImage} className="mr-2 h-6 w-6" />
          <Text className="font-semibold text-black">Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Auth;
