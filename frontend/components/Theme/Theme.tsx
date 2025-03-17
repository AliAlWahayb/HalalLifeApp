/* eslint-disable import/order */
import CheckBox from 'components/Report/Components/CheckBox';
import { View } from 'react-native';
import React from 'react';
import Colors from './Components/Colors';
import Card from 'components/Search/ProductsSearch/Components/Card';
import AliButtons from 'components/Shared/components/FormElements/AliButtons';
import ThemeButtons from './Components/ThemeButtons';
import BottomTabShowcase from './Components/BottomTabShowcase';

const Theme = () => {
  const size = 8;

  return (
    <View className="flex-1 flex-col  justify-between  gap-5 bg-white py-5">
      <View className="flex flex-row flex-wrap items-center justify-center gap-5">
        <Colors size={size} color={['[#77C273]', 'white', 'black']} />
        <Colors size={size} color={['[#A5D6A7]', '[#F1F8E9]', '[#2E2E2E]']} />
        <Colors size={size} color={['[#4A90E2]', '[#1C1C1E]', '[#E0E0E0]']} />
        <Colors size={size} color={['[#8E7B68]', '[#F4ECE4]', '[#303030]']} />
        <Colors size={size} color={['[#FF6347]', '[#FAFAFA]', '[#2D2D2D]']} />
        <Colors size={size} color={['[#8853C8]', 'white', 'black']} />
      </View>
      <View>
        <Card Name="Name" img="" Source="Source" Status="Status" />
      </View>
      <View className="flex flex-row justify-between px-5">
        <View>
          <CheckBox title="Label" onPress={() => {}} isChecked />
        </View>
        <AliButtons title="Text" onPress={() => {}} />
      </View>
      <View pointerEvents="none">
        <BottomTabShowcase />
      </View>
      <View className="flex flex-row justify-center">
        <ThemeButtons />
      </View>
    </View>
  );
};

export default Theme;
