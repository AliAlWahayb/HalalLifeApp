import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useState, useCallback, memo, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { GLOBAL_COLORS } from 'themes/themes';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

/**
 * Product card props interface
 */
interface CardProps {
  /** Product name */
  Name: string;
  /** Product image source */
  img: any;
  /** Source of the product data */
  Source: string;
  /** Halal status of the product */
  Status: 'Halal' | 'Haram' | 'Unknown' | string;
}

/**
 * Product card component for the search results
 */
const Card: React.FC<CardProps> = ({ Name, img, Source, Status }) => {
  const navigation = useNavigation();
  const { theme, globalColors } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handlePress = useCallback(() => {}, [Name]);

  const handleFilterColor = (filter: string) => {
    if (filter === 'All') {
      return theme.colors.primary;
    } else if (filter === 'Halal') {
      return GLOBAL_COLORS.Halal;
    } else if (filter === 'Haram') {
      return GLOBAL_COLORS.Haram;
    } else if (filter === 'Unknown') {
      return GLOBAL_COLORS.Unknown;
    } else {
      return theme.colors.textMuted;
    }
  };

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <Pressable
      onPress={handlePress}
      className="mb-3 w-full overflow-hidden rounded-xl "
      style={{
        borderColor: theme.colors.textMuted,
        shadowColor: theme.colors.textPrimary,
      }}>
      <View className="flex-row p-3">
        <View className="mr-3 h-20 w-20 items-center justify-center overflow-hidden rounded-lg">
          {!img || imageError ? (
            <Image
              source={{ blurhash }}
              contentFit="contain"
              style={{ width: '100%', height: '100%' }}
              alt={`${Name} image`}
            />
          ) : (
            <Image
              source={img}
              placeholder={{ blurhash }}
              contentFit="contain"
              style={{ width: '100%', height: '100%' }}
              alt={`${Name} image`}
            />
          )}
        </View>

        <View className="flex-1 justify-between">
          <View>
            <Text
              className="text-lg font-medium text-textPrimary"
              adjustsFontSizeToFit
              numberOfLines={1}>
              {Name}
            </Text>
            <Text className="mt-1 text-sm text-textMuted" numberOfLines={1}>
              {Source}
            </Text>
          </View>

          <View className="mb-0.5 mt-2 flex-row items-center">
            <View
              className="flex-row items-center rounded-full px-3 py-1"
              style={{
                backgroundColor: handleFilterColor(
                  Status.charAt(0).toUpperCase() + Status.slice(1)
                ),
              }}>
              <Text className="text-md font-medium text-textSecondary">
                {Status.charAt(0).toUpperCase() + Status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(Card);
