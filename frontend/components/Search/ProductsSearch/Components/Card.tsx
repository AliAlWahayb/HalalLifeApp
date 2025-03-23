import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
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
      className="bg-background shadow-textPrimary m-3 flex flex-row rounded-2xl p-4 shadow-2xl"
      style={{ backgroundColor: theme.colors.background }}>
      <View className="flex min-w-[50%] flex-col gap-2 p-2">
        <Text
          className={`text-textPrimary ${dynamicFontSize(Name)} text-wrap`}
          style={{ color: theme.colors.textPrimary }}>
          {Name}
        </Text>
        <Text
          className={`text-textMuted ${dynamicFontSize(Source)} text-wrap`}
          style={{ color: theme.colors.textMuted }}>
          {Source}
        </Text>
        <View
          style={{ backgroundColor: statusColor(Status), height: 40, width: '66%' }}
          className=" items-center justify-center rounded-2xl">
          <Text
            className="text-textSecondary text-lg font-semibold"
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
