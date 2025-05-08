import { Text, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import Checkbox from 'expo-checkbox';
import { useTheme } from 'themes/ThemeProvider';

interface CheckBoxProps {
  title: string;
  onPress: () => void;
  isChecked?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({ title, onPress, isChecked = false }) => {
  const [checked, setChecked] = useState(isChecked);
  const { theme } = useTheme();

  const handleChange = useCallback(() => {
    setChecked(!checked);
    onPress();
  }, [checked, onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleChange}
      className="flex flex-row items-center rounded-xl bg-background py-2">
      <Checkbox
        style={{ marginLeft: 10, marginRight: 10 }}
        value={checked}
        onValueChange={handleChange}
        color={checked ? theme.colors.secondary : undefined}
      />
      <Text className="text-xl font-semibold text-textPrimary" adjustsFontSizeToFit>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
