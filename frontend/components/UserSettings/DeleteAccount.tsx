import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import Buttons from '../Shared/Buttons/Buttons';
import InputForm2 from './com/InputForm2';
import { AuthContext } from '../../context/Auth-context';
import { useForm } from '../../hooks/form-hooks';
import { VALIDATOR_REQUIRE } from '../../util/Validators';
import VerifyCom2 from './com/VerifyCom2';
import CheckBox from 'components/Shared/CheckBox/CheckBox';

const DeleteAccount = ({ goBack }) => {
  const [confirmed, setConfirmed] = useState(false);
  const handleDelete = () => {
    if (!confirmed) {
      Alert.alert('Confirmation Required', 'Please confirm before deleting the account.');
      return;
    }
    console.log('Account Dleted!');
    Alert.alert('Deleted', 'Your account has been deleted.');
    goBack();
  };
  const [formState, inputHandler] = useForm(
    {
      currentUserName: { value: '', isValid: false },
    },
    false
  );

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      <Text className="text-3xl text-red-500">ARE YOU SHURE YOU WANT TO DELETE THE ACCOUNT?</Text>
      <CheckBox
        title="YES I’M SURE"
        isChecked={confirmed}
        onPress={() => setConfirmed(!confirmed)}
      />
      <InputForm2
        element="input"
        id="currentUserName"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter your username!"
        onInput={inputHandler}
        placeholder="Enter current User Name"
        className="mb-4 rounded-lg border border-primary p-4"
      />

      <VerifyCom2 onVerify={(code) => console.log('Verified Code:', code)} />

      <View className="mt-12 items-center">
        <TouchableOpacity
          className="mt-4 rounded-full bg-accent  bg-red-500 px-24 py-4 "
          onPress={goBack}>
          <Text className="text-lg font-bold text-textSecondary">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteAccount;
