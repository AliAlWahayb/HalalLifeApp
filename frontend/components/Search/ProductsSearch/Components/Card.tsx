import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

import { useProduct } from 'hooks/useProduct';
import { GLOBAL_COLORS } from 'themes/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

interface CardProps {
  Name: string;
  img: any;
  Source: string;
  Status: 'Halal' | 'Haram' | 'Unknown' | string;
  code: string;
}

const Card: React.FC<CardProps> = ({ Name, img, Source, Status, code }) => {
  const navigation = useNavigation();
  const { theme, globalColors } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [barcode, setBarcode] = useState('');

  const { data, isLoading, isError, error, isSuccess, refetch } = useProduct(barcode);

  const saveProductLocally = async (barcode: string, productData: any) => {
    try {
      await AsyncStorage.setItem(String(barcode), JSON.stringify(productData));
    } catch (error) {
      console.error('Error saving product locally:', error);
    }
  };

  const getProductFromLocal = async (barcode: string) => {
    try {
      const productData = await AsyncStorage.getItem(String(barcode));
      if (productData) {
        return { ...JSON.parse(productData), isFromLocal: true };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving product from local storage:', error);
      return null;
    }
  };

  const redirectToProduct = useCallback(
    (productData: {
      halal_analysis: { halal_status: string; why: any; additives: any };
      product: any;
    }) => {
      if (productData.halal_analysis.halal_status === 'halal') {
        (navigation.navigate as any)('Camera', {
          screen: 'Halal',
          params: {
            productData: productData.product,
            halalStatus: productData.halal_analysis.halal_status,
            why: productData.halal_analysis.why,
            additives: productData.halal_analysis.additives,
          },
        });
      }
      if (productData.halal_analysis.halal_status === 'haram') {
        (navigation.navigate as any)('Camera', {
          screen: 'Haram',
          params: {
            productData: productData.product,
            halalStatus: productData.halal_analysis.halal_status,
            why: productData.halal_analysis.why,
            additives: productData.halal_analysis.additives,
          },
        });
      }
      if (productData.halal_analysis.halal_status === 'unknown') {
        (navigation.navigate as any)('Camera', {
          screen: 'Unknown',
          params: {
            productData: productData.product,
            halalStatus: productData.halal_analysis.halal_status,
            why: productData.halal_analysis.why,
            additives: productData.halal_analysis.additives,
          },
        });
      }
      if (productData.halal_analysis.halal_status === 'not found') {
        (navigation.navigate as any)('Camera', {
          screen: 'NotFound',
        });
      }
    },
    [navigation]
  );

  const handlePress = () => {
    setBarcode(code);
  };

  useEffect(() => {
    if (barcode) {
      const fetchProduct = async () => {
        const localProduct = await getProductFromLocal(barcode);
        if (localProduct) {
          console.log('Product found locally.');
          if (localProduct.isFromLocal) {
            console.log('This product was retrieved from local storage.');
          }
          redirectToProduct(localProduct);
          return; // Exit early to prevent API call
        }

        // If not found locally, fetch from server
        refetch();
      };

      fetchProduct();
    }
  }, [barcode, refetch, redirectToProduct]);

  useEffect(() => {
    if (isSuccess) {
      saveProductLocally(barcode, data);
      redirectToProduct(data);
    }
    if (isError) {
      (navigation.navigate as any)('Camera', {
        screen: 'NotFound',
      });
    }
    setBarcode('');
  }, [isSuccess, isError, data, navigation]);

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
