import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import Buttons from '../Shared/Buttons/Buttons';
import InputForm2 from './com/InputForm2';
import { AuthContext } from '../context/Auth-context';
import { useForm } from '../../hooks/form-hooks';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../util/Validators';
import CheckBox from 'components/Shared/CheckBox/CheckBox';
import { useNavigation } from '@react-navigation/native';
import { API_BASE } from 'hooks/useProduct';

const DeleteAccount = ({ goBack }) => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();
  const [confirmed, setConfirmed] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      currentUserName: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    false
  );

  const handleDelete = async () => {
    if (!confirmed) {
      return Alert.alert('Confirmation Required', 'Please confirm before deleting the account.');
    }

    if (!formState.isValid) {
      return Alert.alert('Error', 'Please fill in all required fields correctly.');
    }

    const usernameInput = formState.inputs.currentUserName.value;
    const passwordInput = formState.inputs.password.value;

    if (usernameInput !== auth.name) {
      return Alert.alert('Error', 'Entered username does not match your account.');
    }

    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: auth.email, password: passwordInput }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.detail || 'Password verification failed.');
      }

      // Password correct, proceed with account deletion
      const delResponse = await fetch(`${API_BASE}/users/delete-account/${auth.userId}`, {
        method: 'DELETE',
      });

      const delData = await delResponse.json();
      if (!delResponse.ok) throw new Error(delData.detail || 'Failed to delete account');

      Alert.alert('Deleted', 'Your account has been deleted.');
      auth.logout();
      navigation.navigate('Welcome');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="mb-4 text-2xl font-bold text-red-500">
        ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?
      </Text>

      <CheckBox
        title="YES, I’M SURE"
        isChecked={confirmed}
        onPress={() => setConfirmed(!confirmed)}
      />

      <InputForm2
        element="input"
        id="currentUserName"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter your current username"
        onInput={inputHandler}
        placeholder="Enter current User Name"
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <InputForm2
        element="input"
        id="password"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password"
        onInput={inputHandler}
        placeholder="Enter your password"
        secureTextEntry
        className="mb-8 rounded-lg border border-primary p-4"
      />

      <TouchableOpacity className="mb-4 w-full rounded-full bg-red-600 py-4" onPress={handleDelete}>
        <Text className="text-center text-lg font-bold text-white">Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-full rounded-full bg-gray-300 py-4" onPress={goBack}>
        <Text className="text-center text-lg font-bold text-black">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccount;
