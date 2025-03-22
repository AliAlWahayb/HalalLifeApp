import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';

interface Props {
  title: string;
  onPress: () => void;
  isChecked?: boolean;
}

const CheckBox = ({ title, onPress, isChecked }: Props) => {
  const [checked, setChecked] = React.useState(isChecked || false);

  const HandleChange = () => {
    setChecked(!checked);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={HandleChange}
      className="flex flex-row items-center rounded-xl bg-white py-2">
      <Checkbox
        style={{ marginLeft: 20, marginRight: 10 }}
        value={checked}
        onValueChange={setChecked}
        color={checked ? '#61A55D' : undefined}
      />
      <Text className="text-2xl font-semibold text-black">{title}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
