import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Buttons from '../Shared/Buttons/Buttons';
import InputForm from '../Shared/FormElements/InputForm';
import { AuthContext } from '../../context/Auth-context';
import { useForm } from '../../hooks/form-hooks';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/Validators';
import VerifyCom from '../../components/Users/components/VerifyCom';

const ChangePass = ({ goBack }) => {
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
    {
      currentPassword: { value: '', isValid: false },
      newPassword: { value: '', isValid: false },
      confirmNewPassword: { value: '', isValid: false },
    },
    false
  );

  const updatePasswordHandler = () => {
    if (!formState.isValid) {
      console.log('Invalid Password');
      return;
    }
    console.log('Password Updated:', formState.inputs.newPassword.value);
    auth.login();
    goBack();
  };

  return (
    <View className="flex-1 bg-background px-6 ">
      <InputForm
        element="input"
        id="currentPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password."
        onInput={inputHandler}
        placeholder="Enter current password"
        secureTextEntry={true}
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <InputForm
        element="input"
        id="newPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password."
        onInput={inputHandler}
        placeholder="Enter new password"
        secureTextEntry={true}
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <InputForm
        element="input"
        id="confirmNewPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Passwords must match."
        onInput={inputHandler}
        placeholder="Confirm new password"
        secureTextEntry={true}
        className="mb-7 rounded-lg border border-primary p-4"
      />

      <VerifyCom onVerify={(code) => console.log('Verified Code:', code)} />

      <View className="mt-12 items-center">
        <Buttons className="mt-6 w-3/4 rounded-full bg-accent py-4" onPress={goBack}>
          <Text className="text-lg font-bold text-textSecondary">Back</Text>
        </Buttons>
      </View>
    </View>
  );
};

export default ChangePass;
