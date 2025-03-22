import Buttons from 'components/Shared/Buttons/AliButtons';
import React from 'react';
import { View } from 'react-native';

interface PreferenceButtonsProps {
  handleSubmit: () => void;
  handleReset: () => void;
}

const PreferenceButtons = ({ handleSubmit, handleReset }: PreferenceButtonsProps) => {
  const handleSave = () => {
    handleSubmit();
  };

  return (
    <View className="flex flex-row gap-5 py-6">
      <Buttons title="Reset" onPress={handleReset} />
      <Buttons title="Save" onPress={handleSave} />
    </View>
  );
};

export default PreferenceButtons;
