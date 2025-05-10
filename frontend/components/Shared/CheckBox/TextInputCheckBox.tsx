import { Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';
import { useTheme } from 'themes/ThemeProvider';

const TextInputCheckBox = ({ title, onPress }: { title: string; onPress: () => void }) => {
  const [isChecked, setChecked] = React.useState(false);
  const [text, onChangeText] = React.useState('');

  const HandleChange = () => {
    setChecked(!isChecked);
    onPress();
  };

  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={HandleChange}
      className="flex flex-row items-center py-2">
      <Checkbox
        style={{ marginLeft: 10, marginRight: 10 }}
        value={isChecked}
        onValueChange={setChecked}
        color={isChecked ? theme.colors.secondary : undefined}
      />
      <TextInput
        className="text-textPrimary w-3/4 rounded-lg border-2 border-gray-300  text-xl font-semibold"
        placeholder="Other"
        cursorColor={theme.colors.secondary}
        multiline
        maxLength={256}
        onChangeText={onChangeText}
        value={text}
      />
    </TouchableOpacity>
  );
};

export default TextInputCheckBox;
