import Buttons from 'components/Shared/Buttons/AliButtons';
import React from 'react';
import { View } from 'react-native';

const ProductButtons = () => {
  const handleBack = () => {};
  const handleSend = () => {};

  return (
    <View className="flex flex-row gap-5 py-6">
      <Buttons title="Back" onPress={handleBack} />
      <Buttons title="Send" onPress={handleSend} />
    </View>
  );
};

export default ProductButtons;
