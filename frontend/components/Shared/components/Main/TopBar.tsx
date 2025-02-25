import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopBar = () => {
  const IconSize = 36;

  return (
    <SafeAreaView>
      <View className="flex min-h-12 flex-row justify-between bg-white px-4">
        <TouchableOpacity onPress={() => console.log('test')}>
          <MaterialCommunityIcons name="information-variant" size={IconSize} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('test')}>
          <Entypo name="menu" size={IconSize} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TopBar;
