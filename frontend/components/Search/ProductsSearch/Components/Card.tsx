import { View, Text, TouchableOpacity, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from 'themes/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

interface CardProps {
  Name: string;
  img: any;
  Source: string;
  Status: string;
}

const Card: React.FC<CardProps> = ({ Name, img, Source, Status }) => {
  const navigation = useNavigation();
  const { theme, globalColors } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    // Navigate to product details
    console.log(`Pressed on product: ${Name}`);
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

  return (
    <Pressable
      onPress={handlePress}
      className="mb-3 w-full overflow-hidden rounded-xl "
      style={({ pressed }) => [
        {
          borderWidth: 1,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
      ]}>
      <View className="flex-row p-3">
        <View className="mr-3 h-20 w-20 items-center justify-center overflow-hidden rounded-lg">
          {!img || imageError ? (
            <FontAwesome5
              name="shopping-bag"
              size={30}
              color={theme.colors.textMuted}
              style={{ opacity: 0.7 }}
            />
          ) : (
            <Image
              source={img}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              onError={() => setImageError(true)}
            />
          )}
        </View>

        <View className="flex-1 justify-between">
          <View>
            <Text
              className="text-lg font-medium"
              style={{ color: theme.colors.textPrimary }}
              numberOfLines={1}>
              {Name}
            </Text>
            <Text
              className="mt-1 text-sm"
              style={{ color: theme.colors.textMuted }}
              numberOfLines={1}>
              {Source}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center" style={{ marginBottom: 2 }}>
            <View
              className="flex-row items-center rounded-full px-3 py-1"
              style={{
                backgroundColor: `${getStatusColor(Status)}`,
              }}>
              <Text className="text-md font-medium" style={{ color: theme.colors.textSecondary }}>
                {Status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Card;
