import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

import { useProduct } from 'hooks/useProduct';
import { GLOBAL_COLORS } from 'themes/themes';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

interface CardProps {
  Name: string;
  img: any;
  Source: string;
  Status: 'Halal' | 'Haram' | 'Unknown' | string;
  code: string;
  additives: string[];
  ingredients: string;
}

const Card: React.FC<CardProps> = ({ Name, img, Source, Status, code, additives, ingredients }) => {
  const navigation = useNavigation();
  const { theme, globalColors } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [barcode, setBarcode] = useState('');

  const { data, isLoading, isError, error, isSuccess, refetch } = useProduct(barcode);

  const redirectToProduct = useCallback(() => {
    if (!data || !data.halal_analysis) {
      (navigation.navigate as any)('NotFound');
      return;
    }

    const halalStatus = data.halal_analysis.halal_status;
    const navigationParams = {
      productData: data.product,
      halalStatus: halalStatus,
      why: data.halal_analysis.why,
      additives: data.halal_analysis.additives,
    };

    switch (halalStatus) {
      case 'halal':
        (navigation.navigate as any)('Camera', { screen: 'Halal', params: navigationParams });
        break;
      case 'haram':
        (navigation.navigate as any)('Camera', { screen: 'Haram', params: navigationParams });
        break;
      case 'unknown':
        (navigation.navigate as any)('Camera', { screen: 'Unknown', params: navigationParams });
        break;
      case 'not found':
        (navigation.navigate as any)('NotFound');
        break;
      default:
        (navigation.navigate as any)('NotFound');
        break;
    }
  }, [data, navigation]);

  useEffect(() => {
    if (barcode) {
      refetch();
    }
  }, [barcode, refetch]);

  useEffect(() => {
    if (isSuccess) {
      redirectToProduct();
    }
  }, [isSuccess, redirectToProduct]);

  const handlePress = () => {
    setBarcode(code);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Halal':
        return globalColors.Halal;
      case 'Haram':
        return globalColors.Haram;
      case 'Unknown':
        return globalColors.Unknown;
      default:
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
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-5">
            <ActivityIndicator size="small" color={theme.colors.accent} />
          </View>
        ) : (
          <>
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
                  source={{ uri: img }}
                  placeholder={{ blurhash }}
                  contentFit="contain"
                  style={{ width: '100%', height: '100%' }}
                  onError={handleImageError}
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

              {/* <View className="mt-2">
                <Text className="text-sm" style={{ color: theme.colors.textPrimary }}>
                  Ingredients: {ingredients}
                </Text>
                <Text className="text-sm" style={{ color: theme.colors.textPrimary }}>
                  Additives: {additives.join(', ')}
                </Text>
              </View> */}

              <View className="mb-0.5 mt-2 flex-row items-center">
                <View
                  className="flex-row items-center rounded-full px-3 py-1"
                  style={{
                    backgroundColor: getStatusColor(
                      Status.charAt(0).toUpperCase() + Status.slice(1)
                    ),
                  }}>
                  <Text className="text-md font-medium text-textSecondary">
                    {Status.charAt(0).toUpperCase() + Status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
};

export default memo(Card);
