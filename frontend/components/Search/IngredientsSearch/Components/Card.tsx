import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from 'themes/ThemeProvider';

const dynamicFontSize = (text: string) => {
  const length = text.length;
  if (length < 8) {
    return 'text-xl';
  } else if (length >= 8 && length < 21) {
    return 'text-md';
  } else {
    return 'text-md';
  }
};

const Card = ({ Name, Source, Status }: { Name: string; Source: string; Status: string }) => {
  const { theme, globalColors } = useTheme();

  const statusColor = (status: string) => {
    if (status === 'Halal') return globalColors.Halal;
    if (status === 'Haram') return globalColors.Haram;
    if (status === 'Unknown') return globalColors.Unknown;
    return globalColors.Muted;
  };

  return (
    <View className="bg-background shadow-textPrimary m-3 max-w-lg flex-row justify-between rounded-2xl p-4 shadow-2xl">
      <View className="flex flex-shrink flex-col px-2">
        <Text className={`text-textPrimary ${dynamicFontSize(Name)} text-wrap`}>{Name}</Text>
        <Text className={`text-textMuted ${dynamicFontSize(Source)} text-wrap`}>{Source}</Text>
      </View>
      <View
        style={{ backgroundColor: statusColor(Status), height: 40 }}
        className="w-1/3 items-center justify-center rounded-2xl">
        <Text className="text-textSecondary text-lg font-semibold">{Status}</Text>
      </View>
    </View>
  );
};

export default Card;
