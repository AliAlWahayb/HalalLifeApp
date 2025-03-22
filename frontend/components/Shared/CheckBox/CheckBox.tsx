import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';
import { useTheme } from 'themes/ThemeProvider';

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

  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={HandleChange}
      className="bg-background flex flex-row items-center rounded-xl py-2">
      <Checkbox
        style={{ marginLeft: 20, marginRight: 10 }}
        value={checked}
        onValueChange={setChecked}
        color={checked ? theme.colors.secondary : undefined}
      />
      <Text className="text-textPrimary text-2xl font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
