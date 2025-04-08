import React from 'react';
import { View, Text } from 'react-native';
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
    <View className="m-2 max-w-lg flex-row justify-between rounded-2xl bg-background p-4 shadow-2xl shadow-textPrimary">
      <View className="flex flex-shrink flex-col px-2">
        <Text className="text-wrap font-semibold text-textPrimary" adjustsFontSizeToFit>
          {Name}
        </Text>
        <Text className="text-wrap  text-textMuted" adjustsFontSizeToFit>
          {Source}
        </Text>
      </View>
      <View
        style={{ backgroundColor: statusColor(Status), height: 40 }}
        className="w-1/3 items-center justify-center rounded-2xl">
        <Text className="text-lg font-semibold text-textSecondary">{Status}</Text>
      </View>
    </View>
  );
};

export default Card;
