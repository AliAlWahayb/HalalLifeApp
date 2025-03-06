import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';

const CheckBox = ( { title, onPress }: { title: string; onPress: () => void }) => {
  const [isChecked, setChecked] = React.useState(false);

  const HandleChange = () => {
    setChecked(!isChecked);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={HandleChange}
      className="flex flex-row items-center py-2">
      <Checkbox
        style={{ marginLeft: 20, marginRight: 10 }}
        value={isChecked}
        onValueChange={setChecked}
        color={isChecked ? '#61A55D' : undefined}
      />
      <Text className="text-2xl font-semibold text-black">{title}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
