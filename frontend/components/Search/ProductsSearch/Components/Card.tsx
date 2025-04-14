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
      className="mb-3 w-full overflow-hidden rounded-xl"
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? theme.colors.highlight : theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }
      ]}
    >
      <View className="flex-row p-3">
        <View className="mr-3 h-20 w-20 rounded-lg overflow-hidden justify-center items-center" style={{ backgroundColor: theme.colors.highlight }}>
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
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              onError={() => setImageError(true)}
            />
          )}
        </View>
        
        <View className="flex-1 justify-between">
          <View>
            <Text 
              className="font-medium text-lg" 
              style={{ color: theme.colors.textPrimary }}
              numberOfLines={1}
            >
              {Name}
            </Text>
            <Text 
              className="text-sm mt-1" 
              style={{ color: theme.colors.textSecondary }}
              numberOfLines={1}
            >
              {Source}
            </Text>
          </View>
          
          <View 
            className="flex-row items-center mt-2" 
            style={{ marginBottom: 2 }}
          >
            <View 
              className="h-3 w-3 rounded-full mr-2" 
              style={{ backgroundColor: getStatusColor(Status) }}
            />
            <Text 
              className="font-medium"
              style={{ color: getStatusColor(Status) }}
            >
              {Status}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Card;
