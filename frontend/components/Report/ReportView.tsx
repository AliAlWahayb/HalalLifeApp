import { View, Text } from 'react-native';
import React from 'react';
import Checkbox from './Components/CheckBox';
import TextInputCheckBox from './Components/TextInputCheckBox';
import ReportButtons from './Components/ReportButtons';

const ReportView = () => {
  return (
    <View className="flex-1 flex-col bg-white px-5 py-5 ">
      <Text className="text-center text-4xl font-bold text-[#61A55D]">Reason For Report</Text>
      <View className="flex flex-col gap-2 py-3">
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <TextInputCheckBox title="Product is not halal" onPress={() => {}} />
      </View>
      <View className="flex flex-col ">
        <Text className="text-2xl font-bold ">Hint</Text>
        <Text className=" text-gray-500">You Can Select More Than One</Text>
      </View>
      <View className='items-center'>
        <ReportButtons />
      </View>
    </View>
  );
};

export default ReportView;
