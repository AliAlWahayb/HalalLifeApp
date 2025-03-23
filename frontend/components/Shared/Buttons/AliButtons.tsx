import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

interface ButtonProps {
  title: string;
  icon?: JSX.Element;
  classname?: string;
  onPress: () => void;
}

const Buttons = ({ title, icon, classname, onPress }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    onPress();
  };

  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`flex h-12 ${classname ? classname : 'w-5/12'} bg-accent items-center justify-center rounded-full`}
      onPress={handlePress}
      style={{ backgroundColor: theme.colors.accent }}>
      <View className="flex h-full w-full flex-row items-center justify-center gap-2 ">
        {icon && icon}
        <Text
          className="text-textSecondary text-center text-2xl font-semibold"
          style={{ color: theme.colors.textSecondary }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Buttons;
