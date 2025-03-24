import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Buttons from '../../Shared/components/FormElements/Buttons';
import InputForm from '../../Shared/components/FormElements/InputForm';
import { AuthContext } from 'components/Shared/context/Auth-context';
import { useForm } from '../../Shared/hooks/form-hooks';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../Shared/util/Validators';
import VerifyCom from '../components/VerifyCom';
import { useNavigation } from '@react-navigation/native';

const ChangePass = () => {
  const navigation = useNavigation();
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
    navigation.navigate('Home');
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* ✅ إدخال كلمة المرور الحالية */}
      <InputForm
        element="input"
        id="currentPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password."
        onInput={inputHandler}
        placeholder="Enter current password"
        secureTextEntry={true}
        className="mb-4 rounded-lg border border-green-400 p-4"
      />

      {/* ✅ إدخال كلمة المرور الجديدة */}
      <InputForm
        element="input"
        id="newPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password."
        onInput={inputHandler}
        placeholder="Enter new password"
        secureTextEntry={true}
        className="mb-4 rounded-lg border border-green-400 p-4"
      />

      {/* ✅ تأكيد كلمة المرور الجديدة */}
      <InputForm
        element="input"
        id="confirmNewPassword"
        type="password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
        errorText="Passwords must match."
        onInput={inputHandler}
        placeholder="Confirm new password"
        secureTextEntry={true}
        className="mb-6 rounded-lg border border-green-400 p-4"
      />

      {/* ✅ مكون التحقق عبر الكود */}
      <VerifyCom onVerify={(code) => console.log('Verified Code:', code)} />

      {/* ✅ زر الرجوع */}
      <View className="mt-12 items-center">
        <Buttons
          className="mt-6 w-3/4 rounded-full bg-[#77C273] py-4"
          onPress={() => navigation.goBack()}>
          <Text className="text-lg font-bold text-white">Back</Text>
        </Buttons>
      </View>
    </View>
  );
};

export default ChangePass;
