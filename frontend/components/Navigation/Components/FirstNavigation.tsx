import { createStackNavigator } from '@react-navigation/stack';
import Auth from 'components/Users/pages/Auth';
import ForgetPass from 'components/Users/pages/ForgetPass';
import NewPassword from 'components/Users/pages/NewPass';
import Registration from 'components/Users/pages/Registration';
import VerifyCode from 'components/Users/pages/VerifyCode';
import Welcome from 'components/Users/pages/Welcome';
import VerifyCom3 from 'components/UserSettings/com/VerifyCom3';
import React from 'react';
import { View } from 'react-native';

export default function App() {
  const Stack = createStackNavigator();
  return (
    <View className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="ForgetPass" component={ForgetPass} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="VerfyCode" component={VerifyCode} />
        <Stack.Screen name="VerifyCom3" component={VerifyCom3} />
        <Stack.Screen name="NewPassword" component={NewPassword} />

      </Stack.Navigator>
    </View>
  );
}
