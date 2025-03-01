import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

interface AccordionProps {
  title: string;
  number?: number; // Optional number
  children: React.ReactNode;
}

const Accordion = ({ title, number, children }: AccordionProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleAccordion = () => setCollapsed(!collapsed);

  return (
    <View className="mb-2 w-full">
      <TouchableOpacity
        onPress={toggleAccordion}
        style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
        className="flex flex-row items-center justify-between px-2 py-3 ">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-2xl font-bold">{title}</Text>
          {number && <Text className="text-2xl font-bold">{number}</Text>}
        </View>
        <MaterialIcons
          name={collapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
          size={28}
          color="black"
        />
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <View className="p-4">{children}</View>
      </Collapsible>
    </View>
  );
};

export default Accordion;
