import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Navigation from 'components/Navigation/Components/Navigation';
import Welcome from 'components/Users/pages/Welcome';
import Auth from 'components/Users/pages/Auth';
import HomeView from 'components/Home/HomeView';
import ForgetPass from 'components/Users/pages/ForgetPass';

export default function Nav() {
  const Stack = createStackNavigator();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={Navigation} />
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Forgetpass" component={ForgetPass} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
