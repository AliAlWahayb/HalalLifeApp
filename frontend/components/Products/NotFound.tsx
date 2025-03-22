import { View, Text, Button } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Buttons from 'components/Shared/components/FormElements/AliButtons';
import { useNavigation } from '@react-navigation/native';

const NotFound = () => {
  const navigation = useNavigation();

  const HandleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 items-center  bg-white py-5">
      <View className="flex w-5/6 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-[#F76666] p-3">
        <View className="rounded-full bg-[#F76666] p-2">
          <Ionicons name="alert-sharp" size={42} color="white" />
        </View>
        <Text className="text-3xl font-bold text-black">Item Not Found</Text>
        <View className="flex flex-col gap-3">
          <Buttons title="Chat Bot" classname="w-fit" onPress={() => {}} />
          <Buttons title="Search ingredients" classname="w-fit" onPress={() => {}} />
          <Buttons title="Go Back" classname="w-fit" onPress={HandleBack} />
        </View>
      </View>
    </View>
  );
};

export default NotFound;
