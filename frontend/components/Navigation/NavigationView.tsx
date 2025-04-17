import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';

import FirstNavigation from './Components/FirstNavigation';
import Navigation from './Components/Navigation';

const Stack = createNativeStackNavigator();

const NavigationView = () => {
  return (
    <View className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FirstNavigation" component={FirstNavigation} />
        <Stack.Screen name="Navigation" component={Navigation} />
      </Stack.Navigator>
    </View>
  );
};

export default NavigationView;
