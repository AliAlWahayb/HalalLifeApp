import { View, Text } from 'react-native';
import React from 'react';

const FakeView = () => {
  return (
    <>
      <View className="flex flex-col p-5">
        <Text className="pt-5 text-2xl font-bold text-yellow-500">Welcome to Menu</Text>
        <Text className="pt-5 text-lg font-black text-red-600">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde voluptas molestiae odit rem
          autem libero nihil incidunt saepe ad possimus non totam assumenda laudantium optio, quam
          earum facere, et veritatis.
        </Text>
      </View>
    </>
  );
};

export default FakeView;
