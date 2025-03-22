import {Text,View} from "react-native"
import {
    VALIDATOR_EMAIL,
    VALIDATOR_REQUIRE,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH
  } from '../../Shared/util/Validators';
import InputForm from '../../Shared/components/FormElements/InputForm';
import Buttons from '../../Shared/components/FormElements/Buttons';
import Header from "../components/Header";
import React, { useState , useContext } from 'react';
import { useForm } from '../../Shared/hooks/form-hooks';
import { AuthContext } from '../../Shared/context/Auth-context';

const Registration = () =>{

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
              VALIDATOR_MAXLENGTH(12)
            ]}
            errorText="Please enter a valid phone number (9-12 digits)."
            onInput={inputHandler}
            />

            </View>

           <View className="flex-col items-center mt-4  w-full">
            <Buttons onPress={authSubmitHandler}>Send</Buttons>
               
            
            </View>


        </View>

        



            
       
    )
 
}

export default Registration;
