import { Image } from 'expo-image';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

const dynamicFontSize = (text: string) => {
  const length = text.length;
  if (length < 8) {
    return 'text-xl'; // Large font for short text
  } else if (length >= 8 && length < 21) {
    return 'text-md'; // Medium font for medium-length text
  } else {
    return 'text-sm'; // Smaller font for long text
  }
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Card = ({
  Name,
  img,
  Source,
  Status,
}: {
  Name: string;
  img: string;
  Source: string;
  Status: string;
}) => {
  const handlePress = () => {
    console.log(Name);
  };

  const { theme, globalColors } = useTheme();

  const statusColor = (status: string) => {
    if (status === 'Halal') return globalColors.Halal;
    if (status === 'Haram') return globalColors.Haram;
    if (status === 'Unknown') return globalColors.Unknown;
    return globalColors.Muted;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="m-2 flex flex-row rounded-2xl bg-background p-4 shadow-2xl shadow-textPrimary"
      style={{ backgroundColor: theme.colors.background }}>
      <View className="flex min-w-[50%] flex-col gap-2 p-2">
        <Text
          className="text-wrap font-semibold text-textPrimary"
          style={{ color: theme.colors.textPrimary }}
          adjustsFontSizeToFit>
          {Name}
        </Text>
        <Text
          className="text-wrap text-textMuted"
          style={{ color: theme.colors.textMuted }}
          adjustsFontSizeToFit>
          {Source}
        </Text>
        <View
          style={{ backgroundColor: statusColor(Status), height: 40, width: '66%' }}
          className=" items-center justify-center rounded-2xl">
          <Text
            className="text-lg font-semibold text-textSecondary"
            style={{ color: theme.colors.textSecondary }}>
            {Status}
          </Text>
        </View>
      </View>
      <View className="items-center justify-center rounded-xl px-2">
        <Image
          source={img}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={1000}
          style={{
            width: '100%',
            height: 60,
            aspectRatio: 2,
          }}
          alt={Name}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Card;
