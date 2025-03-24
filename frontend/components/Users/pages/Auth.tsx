
import { View , Text ,Image,TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';
import Buttons from '../../Shared/components/FormElements/Buttons'; 
import InputForm from '../../Shared/components/FormElements/InputForm';
import { AuthContext } from 'components/Shared/context/Auth-context';
import { useForm } from '../../Shared/hooks/form-hooks';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
  } from '../../Shared/util/Validators';
  import GoogleImage from '../../../assets/Social/GoogleImge.png';
  import FacebookImage from '../../../assets/Social/FacebookImge.png';
  import Header from 'components/Users/components/Header';
  import { useRoute , useNavigation  } from '@react-navigation/native';




const Auth = () => {
   const navigation = useNavigation();
    const route = useRoute();
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(route.params?.isLogin ?? true);
    const [formState, inputHandler, setFormData] = useForm(
        {
          email: {
            value: '',
            isValid: false
          },
          password: {
            value: '',
            isValid: false
          }
        },
        false
      );

      const switchModeHandler = () => {
        if (!isLoginMode) {
          setFormData(
            {
              ...formState.inputs,
              name: undefined
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid
          );
        } else {
          setFormData(
            {
              ...formState.inputs,
              name: {
                value: '',
                isValid: false
              }
            },
            false
          );
        }
        setIsLoginMode(prevMode => !prevMode);
      };

      
  const authSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
    auth.login();
  };



    return (

      

      

    
   <View className="flex-1 justify-center items-center px-8 bg-white ">
    <Header/>
    
    <Text className="text-3xl font-bold mb-4 text-[#77C273] w-full">
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
             placeholder="Enter your password"secureTextEntry={true}

              />

           {isLoginMode && (

      <TouchableOpacity>
        <Text onPress={() => navigation.navigate('Forgetpass')} className="text-[#77C273]  text-1xl font-bold ">Forget password?</Text>
      </TouchableOpacity>

     )}

              
  <Buttons  onPress={() => navigation.navigate('Home')}>{isLoginMode ? 'Log In' : 'Sign Up'}</Buttons> 

           

            <TouchableOpacity onPress={switchModeHandler} >
              <Text className='text-gry-300 mt-4'> {isLoginMode ? 'Dont’t have an account?' : 'Already have an account? '} <Text  className='text-[#77C273] font-bold '>{isLoginMode ? 'Sign Up' : 'Log In'}</Text></Text>
            </TouchableOpacity>

            <View className='flex flex-col items-center '>
            
                <Text className='text-gray-400 text-1xl font-bold pt-8 '>Sign in with</Text>
            
               </View >
            
               <View className=" flex-row  mt-4">
                 
                  <TouchableOpacity className="bg-gray-100 rounded-full px-6 py-4 flex flex-row items-center  ">
                    <Image source={FacebookImage} className="w-6 h-6 mr-2" />
                    <Text className="text-black font-semibold">Facebook</Text>
                  </TouchableOpacity>
            
                 
                  <TouchableOpacity className="bg-gray-100 rounded-full px-6 py-4 flex flex-row items-center ml-20">
                    <Image source={GoogleImage} className="w-6 h-6 mr-2" />
                    <Text className="text-black font-semibold">Google</Text>
                  </TouchableOpacity>
                  
                </View>
            
        </View>

        

        
       
    )




}

export default Auth;