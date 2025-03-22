import { View, Text } from 'react-native';
import React from 'react';
import Checkbox from '../Shared/CheckBox/CheckBox';
import TextInputCheckBox from '../Shared/CheckBox/TextInputCheckBox';
import ReportButtons from './Components/ReportButtons';

const ReportView = () => {
  return (
    <View className="bg-background flex-1 flex-col px-5 py-5 ">
      <Text className="text-primary text-center text-4xl font-bold">Reason For Report</Text>
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
        <Text className=" text-textMuted">You Can Select More Than One</Text>
      </View>
      <View className="items-center">
        <ReportButtons />
      </View>
    </View>
  );
};

export default ReportView;
