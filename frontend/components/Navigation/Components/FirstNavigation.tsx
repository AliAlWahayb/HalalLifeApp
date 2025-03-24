import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Welcome from 'components/Users/pages/Welcome';
import Auth from 'components/Users/pages/Auth';
import ForgetPass from 'components/Users/pages/ForgetPass';
import Registration from 'components/Users/pages/Registration';
import VerifyCode from 'components/Users/pages/VerifyCode';

//مشكلة التنقل

export default function App() {
  const Stack = createStackNavigator();
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Forgetpass" component={ForgetPass} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="VerfyCode" component={VerifyCode} />
      </Stack.Navigator>
    </>
  );
}
