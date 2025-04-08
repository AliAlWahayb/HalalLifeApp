import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import Buttons from '../Shared/Buttons/Buttons';
import InputForm from '../Shared/FormElements/InputForm';
import { AuthContext } from '../../context/Auth-context';
import { useForm } from '../../hooks/form-hooks';
import { VALIDATOR_REQUIRE } from '../../util/Validators';
import VerifyCom from '../../components/Users/components/VerifyCom';


const ChangeUnami = ({ goBack }) => {
  
  const [formState, inputHandler] = useForm(
    {
      currentUserName: { value: '', isValid: false },
      newUsername: { value: '', isValid: false },
    },
    false
  );
  

  return (
    <View className="flex-1 bg-textSecondary px-6 pt-12">
      <InputForm
        element="input"
        id="currentUserName"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter your username!"
        onInput={inputHandler}
        placeholder="Enter current User Name"
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <InputForm
        element="input"
        id="newUsername"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="This username is already taken."
        onInput={inputHandler}
        placeholder="Enter new User Name"
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <VerifyCom onVerify={(code) => console.log('Verified Code:', code)} />

      <View className="mt-12 items-center">
        <Buttons
          className="mt-6 w-3/4 rounded-full bg-accent py-4"
          onPress={goBack} 
        >
          <Text className="text-lg font-bold text-textSecondary">Back</Text>
        </Buttons>
      </View>
    </View>
  );
};

export default ChangeUnami;
