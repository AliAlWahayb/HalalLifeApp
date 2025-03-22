import { View, Text, Button } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Buttons from 'components/Shared/Buttons/AliButtons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'themes/ThemeProvider';

const NotFound = () => {
  const { theme } = useTheme();

  const navigation = useNavigation();

  const HandleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="bg-background flex-1  items-center py-5">
      <View className="border-Haram flex w-5/6 flex-col items-center justify-center gap-2 rounded-3xl border-4 p-3">
        <View className="bg-Haram rounded-full p-2">
          <Ionicons name="alert-sharp" size={42} color={theme.colors.textSecondary} />
        </View>
        <Text className="text-textPrimary text-3xl font-bold">Item Not Found</Text>
        <View className="flex flex-col gap-3">
          <Buttons title="Chat Bot" classname="w-fit" onPress={() => {}} />
          <Buttons title="Search ingredients" classname="w-fit" onPress={() => {}} />
          <Buttons title="Go Back" classname="w-fit" onPress={HandleBack} />
        </View>
      </View>
    </View>
  );
};

export default NotFound;
