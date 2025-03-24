import {Text,View,Alert} from "react-native"
import {
    VALIDATOR_EMAIL,
    VALIDATOR_REQUIRE
  } from '../../Shared/util/Validators';
import InputForm from '../../Shared/components/FormElements/InputForm';
import Buttons from '../../Shared/components/FormElements/Buttons';
import Header from "../components/Header";
import React, { useState , useContext } from 'react';
import { useForm } from '../../Shared/hooks/form-hooks';
import { AuthContext } from '../../Shared/context/Auth-context';
import { useNavigation } from '@react-navigation/native';



const ForgetPass = () =>{

  const navigation = useNavigation();
  const auth = useContext(AuthContext);

      const [formState, inputHandler, setFormData] = useForm(
          {
            email: {
              value: '',
              isValid: false
            },
    });
    

    const authSubmitHandler = event => {
      if (!formState.isValid) {
        Alert.alert("Invalid Input", "Please enter a valid email address.", [{ text: "OK" }]);
        return;
      }
        Alert.alert(
          "password Reset",
          `A reset link has been sent to ${formState.inputs.email.value}`,
          [{ text: "OK", onPress: () => navigation.navigate("Auth") }]
          
        );
      
      };



    return (

        
        <View className="flex-1 justify-center items-center px-8 bg-white">
            <Header/>
            <Text className='text-[#77C273] font-bold text-4xl m-2 mr-14'>Resset Password</Text>
            <Text className='text-gray-400 font-bold text-sm mr-24'>please enter your email address to request a Password rest</Text>
            

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

           <View className="flex-col items-center mt-4  w-full">
            <Buttons onPress={authSubmitHandler}>Send New Password</Buttons>
               
            
            </View>


        </View>

        



            
       
    )
 
}

export default ForgetPass;
