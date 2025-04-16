import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from 'themes/ThemeProvider';
import { Image } from 'expo-image';
// Placeholder image blurhash

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

/**
 * Hero component props interface
 */
interface HeroProps {
  // Add any future props here
}

/**
 * Hero section component for the homepage
 */
const Hero: React.FC<HeroProps> = () => {
  const { theme } = useTheme();

  return (
    <View className="mb-6 px-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="mb-1.5 text-2xl font-bold leading-9 text-textPrimary">Welcome to</Text>
          <Text className="text-3xl font-bold leading-10 text-primary">HalalLife</Text>
          <Text className="mt-2 text-base text-textMuted">Explore halal options around you</Text>
        </View>

        <Image
          source={require('../../../assets/Home/Home.png')}
          className="h-30 w-30"
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={300}
          alt="HalalLife logo"
        />
      </View>
    </View>
  );
};

export default memo(Hero);
