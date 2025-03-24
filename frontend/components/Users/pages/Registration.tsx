import {Text,View,TouchableOpacity} from "react-native"
import {VALIDATOR_EMAIL,VALIDATOR_REQUIRE,VALIDATOR_MAXLENGTH,VALIDATOR_MINLENGTH} from '../../Shared/util/Validators';
import Buttons from '../../Shared/components/FormElements/Buttons';
import Header from "../components/Header";
import React, { useState , useContext } from 'react';
import { useForm } from '../../Shared/hooks/form-hooks';
import { AuthContext } from '../../Shared/context/Auth-context';
import { useNavigation  } from '@react-navigation/native';
import PhoneInputForm from '../components/PhoneInputForm';
import InputForm from "components/Shared/components/FormElements/InputForm";

const Registration = () =>{
    
    const navigation = useNavigation();
    const auth = useContext(AuthContext);
  
        const [formState, inputHandler, setFormData] = useForm(
            {
              Number: {
                value: '',
                isValid: false
              },
      });



    const authSubmitHandler = () => {
      if(!formState.isValid){
        console.log("Invalid Number");
        return;
      }
      console.log("Number verification request sent for: ", formState.inputs.number.value);
      auth.login();


      };



    return (

            <View className="flex-1 justify-center items-center px-8 bg-white">

            <Header/>
            <Text className='text-[#77C273] font-bold text-4xl m-2 mr-32'>Registrations</Text>
            <Text className='text-gray-400 font-bold text-sm mr-24'>Enter your phone number to verify your account</Text>
    

            <View className="w-full  items-center">
            <InputForm 
              element="input"
              id="numeric"
              type="int"
             validators={[
              VALIDATOR_REQUIRE(), 
              VALIDATOR_MINLENGTH(9), 
              VALIDATOR_MAXLENGTH(12),
                ]}
            errorText="Please enter a valid phone number (9-12 digits)."
            onInput={inputHandler}
              />

            </View>

           <View className="flex-col items-center mt-4  w-full">
           <Buttons  onPress={() => navigation.navigate('VerfyCode')}>Send</Buttons>
               
            
            </View>

            <View >
            <TouchableOpacity  onPress={() => navigation.navigate('Auth', { isLogin: false })}>       
            <Text className='text-gry-300 m-4 ' >Sign up in your <Text className="text-[#77C273] font-bold mr-4  "> E-mail </Text> </Text>
            </TouchableOpacity>

            </View>
        </View>
    )
 
};

export default Registration;
