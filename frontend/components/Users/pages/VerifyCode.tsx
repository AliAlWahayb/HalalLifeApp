

import {Text,View} from "react-native"
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
  } from '../../Shared/util/Validators';
import InputForm from '../../Shared/components/FormElements/InputForm';
import Buttons from '../../Shared/components/FormElements/Buttons';
import Header from "../components/Header";
import React, { useState , useContext } from 'react';
import { useForm } from '../../Shared/hooks/form-hooks';
import { AuthContext } from '../../Shared/context/Auth-context';

const VerifyCode = () =>{

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
            console.log("Invalid Code");
            return;
          }
          console.log(" ", formState.inputs.number.value);
          auth.login();
    
    
          };

    return (

        <View className="flex-1 justify-center items-center px-8 bg-white">
            <Header/>
            <Text className='text-[#77C273] font-bold text-4xl m-2 ml-4 w-full'>Verification Code</Text>
            <Text className='text-gray-400 font-bold text-sm mr-20'>please type the Verification Code send to your number </Text>
    

            <View className="w-full  items-center">

            <InputForm 
            element="input"
            id="numeric"
            type="int"
            validators={[
              VALIDATOR_REQUIRE(), 
              VALIDATOR_MINLENGTH(4)
              
            ]}
            errorText="Please enter a valid Code "
            onInput={inputHandler}
            />

            </View>

           <View className="flex-col items-center mt-4  w-full">
            
            <Text className='text-gray-400 font-bold text-sm'>I Dont’t recevie a code! <Text className="text-[#77C273] font-bold text-sm">Plaese resend</Text></Text>
               
            
            </View>


        </View>

        



            
       
    )
 
}

export default VerifyCode;
