import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Halal from 'components/Products/Halal';
import Haram from 'components/Products/Haram';
import NotFound from 'components/Products/NotFound';
import Unknown from 'components/Products/Unknown';
import React from 'react';
import { View } from 'react-native';

import Scanner from './Components/Scanner';
import ReportView from 'components/Report/ReportView';

const CameraView = () => {
  const Stack = createNativeStackNavigator();
  

  return (
    <View className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Scanner">
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="Halal" component={Halal}  />
        <Stack.Screen name="Haram" component={Haram} />
        <Stack.Screen name="Unknown" component={Unknown} />
        <Stack.Screen name="NotFound" component={NotFound} />
        <Stack.Screen name="ReportView" component={ReportView} />
      </Stack.Navigator>
    </View>
  );
};

export default CameraView;
