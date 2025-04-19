/* eslint-disable import/order */
import CheckBox from 'components/Shared/CheckBox/CheckBox';
import { View } from 'react-native';
import React from 'react';
import Colors from './Components/Colors';
import Card from 'components/Search/ProductsSearch/Components/Card';
import AliButtons from 'components/Shared/Buttons/AliButtons';
import BottomTabShowcase from './Components/BottomTabShowcase';
import TwoButtons from 'components/Shared/Buttons/TwoButtons';
import ThemeSwitcher from './Components/ThemeSwitcher';

const Theme = () => {
  const size = 16;

  return (
    <View className="bg-background flex-1  flex-col  justify-between  py-5">
      <View className="flex flex-col gap-2">
        <View className="flex flex-row flex-wrap items-center justify-center" style={{ gap: 60 }}>
          <ThemeSwitcher />
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
      </View>
      <View className="items-center ">
        <TwoButtons title1="Back" title2="Save" handle1={() => {}} handle2={() => {}} />
      </View>
    </View>
  );
};

export default Theme;
