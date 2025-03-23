import TwoButtons from 'components/Shared/Buttons/TwoButtons';
import React from 'react';
import { View, Text } from 'react-native';

import Checkbox from '../Shared/CheckBox/CheckBox';
import TextInputCheckBox from '../Shared/CheckBox/TextInputCheckBox';

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
        <TwoButtons title1="Cancel" title2="Report" handle1={() => {}} handle2={() => {}} />
      </View>
    </View>
  );
};

export default ReportView;
