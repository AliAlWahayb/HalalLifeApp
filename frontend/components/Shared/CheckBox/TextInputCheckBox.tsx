import { Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';

const TextInputCheckBox = ({ title, onPress }: { title: string; onPress: () => void }) => {
  const [isChecked, setChecked] = React.useState(false);
  const [text, onChangeText] = React.useState('');

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
      <TextInput
        className="w-3/4 rounded-lg border-2 border-gray-300 text-xl  font-semibold text-black"
        placeholder="Other"
        cursorColor="#61A55D"
        multiline
        maxLength={256}
        onChangeText={onChangeText}
        value={text}
      />
    </TouchableOpacity>
  );
};

export default TextInputCheckBox;
