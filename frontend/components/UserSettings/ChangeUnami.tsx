import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Buttons from '../Shared/Buttons/Buttons';
import InputForm from '../Shared/FormElements/InputForm';
import { AuthContext } from '../context/Auth-context';
import { useForm } from '../../hooks/form-hooks';
import { VALIDATOR_REQUIRE } from '../../util/Validators';

const ChangeUnami = ({ goBack }) => {
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
    {
      currentUserName: { value: '', isValid: false },
      newUsername: { value: '', isValid: false },
    },
    false
  );

  const handleChangeUsername = async () => {
    const current = formState.inputs.currentUserName.value;
    const newName = formState.inputs.newUsername.value;

    if (!formState.isValid) {
      return Alert.alert('Error', 'Please fill all fields correctly.');
    }

    if (current !== auth.name) {
      return Alert.alert('Error', 'Current username is incorrect.');
    }

    try {
      const res = await fetch('http://172.20.10.2:8000/api/users/change-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.userId,
          new_name: newName,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.detail || 'Failed to update name.');

     
      auth.login(auth.userId, auth.token, auth.authType, newName, auth.email);

      Alert.alert('Success', 'Username updated successfully!');
      goBack(); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-textSecondary px-6 pt-10">
      <InputForm
        element="input"
        id="currentUserName"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter your current username"
        onInput={inputHandler}
        placeholder="Enter current User Name"
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <InputForm
        element="input"
        id="newUsername"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a new username"
        onInput={inputHandler}
        placeholder="Enter new User Name"
        className="mb-6 rounded-lg border border-primary p-4"
      />

      <Buttons
        className="w-full rounded-full bg-accent py-4"
        onPress={handleChangeUsername}
      >
        <Text className="text-lg font-bold text-textSecondary">Update Name</Text>
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

export default ChangeUnami;
