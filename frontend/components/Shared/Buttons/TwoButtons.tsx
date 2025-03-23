import Buttons from 'components/Shared/Buttons/AliButtons';
import React from 'react';
import { View } from 'react-native';

interface TwoButtonsProps {
  title1: string;
  title2: string;
  icon1?: JSX.Element;
  icon2?: JSX.Element;
  handle1: () => void;
  handle2: () => void;
}

const TwoButtons = ({ title1, title2, icon1, icon2, handle1, handle2 }: TwoButtonsProps) => {
  return (
    <View className="flex flex-row gap-5 py-6">
      <Buttons title={title1} icon={icon1 || undefined} onPress={handle1} />
      <Buttons title={title2} icon={icon2 || undefined} onPress={handle2} />
    </View>
  );
};

export default TwoButtons;
