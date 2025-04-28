import { View, Text, Alert,TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Buttons from '../Shared/Buttons/Buttons';
import InputForm from '../Shared/FormElements/InputForm';
import { AuthContext } from '../context/Auth-context';
import { useForm } from '../../hooks/form-hooks';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/Validators';

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

  const updatePasswordHandler = async () => {
    if (!formState.isValid) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }

    const current = formState.inputs.currentPassword.value;
    const newPass = formState.inputs.newPassword.value;
    const confirm = formState.inputs.confirmNewPassword.value;

    if (newPass !== confirm) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2:8000/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.userId,
          current_password: current,
          new_password: newPass
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.detail || 'Failed to update password.');
      }

      Alert.alert('Success', 'Password updated successfully.');
      goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-4">
      <InputForm
        element="input"
        id="currentPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter your current password."
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
        errorText="Please enter a valid new password."
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

      <Buttons className="mt-6 w-full rounded-full bg-accent py-4" onPress={updatePasswordHandler}>
        <Text className="text-lg font-bold text-textSecondary">Update Password</Text>
      </Buttons>

      <TouchableOpacity
        onPress={goBack}
        className="mt-4 w-full rounded-full bg-gray-300 py-4"
      >
        <Text className="text-center text-lg font-bold text-black">Back</Text>
      </TouchableOpacity>


    </View>
  );
};

export default ChangePass;
