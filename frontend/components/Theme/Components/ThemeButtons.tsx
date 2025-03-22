import Buttons from 'components/Shared/Buttons/AliButtons';
import React from 'react';
import { View } from 'react-native';

const ThemeButtons = () => {
  const handleBack = () => {};
  const handleSave = () => {};

  return (
    <View className="flex flex-row justify-between gap-5 py-6">
      <Buttons title="Back" onPress={handleBack} />
      <Buttons title="Save" onPress={handleSave} />
    </View>
  );
};

export default ThemeButtons;
