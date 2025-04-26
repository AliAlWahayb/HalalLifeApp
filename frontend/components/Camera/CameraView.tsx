import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Default from 'components/Products/737628064502.json';
import Halal from 'components/Products/Halal';
import Haram from 'components/Products/Haram';
import NotFound from 'components/Products/NotFound';
import Unknown from 'components/Products/Unknown';
import React from 'react';
import { View } from 'react-native';

import Scanner from './Components/Scanner';

const CameraView = () => {
  const Stack = createNativeStackNavigator();

  return (
    <View className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Scanner">
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="Halal" component={Halal} />
        <Stack.Screen name="Haram" component={Haram} />
        <Stack.Screen name="Unknown" component={Unknown} />
        <Stack.Screen name="NotFound" component={NotFound} />
      </Stack.Navigator>
    </View>
  );
};

export default CameraView;
