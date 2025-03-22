import {Text,View} from "react-native"
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



const ForgetPass = () =>{

  const auth = useContext(AuthContext);

      const [formState, inputHandler, setFormData] = useForm(
          {
            email: {
              value: '',
              isValid: false
            },
    });
    

    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
        console.log("Password reset request sent.",formState.inputs.email.value);
        auth.login();
      };



    return (

        
        <View className="flex-1 justify-center items-center px-8 bg-white">
            <Header/>
            <Text className='text-[#77C273] font-bold text-4xl m-2 mr-12'>Resset Password</Text>
            <Text className='text-gray-400 font-bold text-sm mr-20'>please enter your email address to</Text>
            <Text className='text-gray-400 font-bold text-sm mr-44'>request a E-mail rest</Text>

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
