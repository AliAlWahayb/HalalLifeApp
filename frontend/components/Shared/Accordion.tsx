import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useTheme } from 'themes/ThemeProvider';

interface AccordionProps {
  title: string;
  number?: string; // Optional number
  children: React.ReactNode;
}

const Accordion = ({ title, number, children }: AccordionProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleAccordion = () => setCollapsed(!collapsed);

  const { theme } = useTheme();

  return (
    <View className="mb-2 w-full">
      <TouchableOpacity
        onPress={toggleAccordion}
        style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.textMuted }}
        className="flex flex-row items-center justify-between px-2 py-3 ">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-2xl font-bold text-textPrimary">{title}</Text>
          {number && <Text className="text-xl text-textPrimary">{number}</Text>}
        </View>
        <MaterialIcons
          name={collapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
          size={28}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <View className="p-4">{children}</View>
      </Collapsible>
    </View>
  );
};

export default Accordion;
