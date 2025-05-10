import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Buttons from 'components/Shared/Buttons/AliButtons';
import React, { useEffect } from 'react';
import { View, Text, Button, BackHandler } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

const NotFound = () => {
  const { theme } = useTheme();

  type RootStackParamList = {
    Chat: undefined;
    Search: undefined;
    [key: string]: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const HandleBack = () => {
    navigation.goBack();
  };

  const HandleChat = () => {
    navigation.navigate('Chat');
  };
  const HandleSearch = () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    const backAction = () => {
      (navigation.navigate as any)({ name: 'Scanner' });
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <View className="flex-1 items-center  bg-background py-5">
      <View className="flex w-5/6 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-Haram p-3">
        <View className="rounded-full bg-Haram p-2">
          <Ionicons name="alert-sharp" size={42} color={theme.colors.textSecondary} />
        </View>
        <Text className="text-3xl font-bold text-textPrimary">Item Not Found</Text>
        <View className="flex flex-col gap-3">
          <Buttons title="Chat Bot" classname="w-fit" onPress={HandleChat} />
          <Buttons title="Search ingredients" classname="w-fit" onPress={HandleSearch} />
          <Buttons title="Go Back" classname="w-fit" onPress={HandleBack} />
        </View>
      </View>
    </View>
  );
};

export default NotFound;
