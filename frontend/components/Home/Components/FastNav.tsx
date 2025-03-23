import Buttons from 'components/Shared/Buttons/AliButtons';
import React from 'react';
import { View } from 'react-native';

const FastNav = () => {
  return (
    <View className="flex flex-col items-center gap-5">
      <View className="flex flex-row  gap-5">
        <Buttons title="Scanner" onPress={() => {}} />
        <Buttons title="Liked" onPress={() => {}} />
      </View>
      <View className="flex flex-row gap-5">
        <Buttons title="Search" onPress={() => {}} />
        <Buttons title="History" onPress={() => {}} />
      </View>
    </View>
  );
};

export default FastNav;
