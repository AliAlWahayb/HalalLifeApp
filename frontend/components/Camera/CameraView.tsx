import { createNativeStackNavigator } from '@react-navigation/native-stack';
import data2 from 'components/Products/0037600104029.json';
import data1 from 'components/Products/737628064502.json';
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
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Unknown">
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="Halal" children={(props) => <Halal {...props} productData={data1} />} />
        <Stack.Screen name="Haram" children={(props) => <Haram {...props} productData={data2} />} />
        <Stack.Screen
          name="Unknown"
          children={(props) => <Unknown {...props} productData={data2} />}
        />
        <Stack.Screen name="NotFound" component={NotFound} />
      </Stack.Navigator>
    </View>
  );
};

export default CameraView;
