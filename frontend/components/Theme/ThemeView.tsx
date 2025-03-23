/* eslint-disable import/order */
import CheckBox from 'components/Shared/CheckBox/CheckBox';
import { View } from 'react-native';
import React from 'react';
import Colors from './Components/Colors';
import Card from 'components/Search/ProductsSearch/Components/Card';
import AliButtons from 'components/Shared/Buttons/AliButtons';
import BottomTabShowcase from './Components/BottomTabShowcase';
import TwoButtons from 'components/Shared/Buttons/TwoButtons';

const Theme = () => {
  const size = 16;

  return (
    <View className="bg-background flex-1  flex-col  justify-between  py-5">
      <View className="flex flex-row flex-wrap items-center justify-center" style={{ gap: 60 }}>
        <Colors id="Primary" size={size} color={['#5FCE59', '#ffffff', '#000000']} />
        <Colors id="1" size={size} color={['#A5D6A7', '#F1F8E9', '#2E2E2E']} />
        <Colors id="2" size={size} color={['#4A90E2', '#1C1C1E', '#E0E0E0']} />
        <Colors id="3" size={size} color={['#8E7B68', '#F4ECE4', '#303030']} />
        <Colors id="4" size={size} color={['#FF6347', '#FAFAFA', '#2D2D2D']} />
        <Colors id="5" size={size} color={['#8853C8', '#ffffff', '#000000']} />
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
      <View className="items-center pt-5">
        <TwoButtons title1="Back" title2="Save" handle1={() => {}} handle2={() => {}} />
      </View>
    </View>
  );
};

export default Theme;
