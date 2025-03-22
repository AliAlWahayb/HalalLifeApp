import { View, Text } from 'react-native';
import React from 'react';

const FakeView = () => {
  return (
    <>
      <View className="flex flex-col p-5">
        <Text className="pt-5 text-2xl font-bold text-yellow-500">Welcome to Fake</Text>
      </View>
    </>
  );
};

export default FakeView;
