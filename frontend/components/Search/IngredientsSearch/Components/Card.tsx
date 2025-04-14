import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';

interface CardProps {
  Name: string;
  Source: string;
  Status: string;
}

const Card: React.FC<CardProps> = ({ Name, Source, Status }) => {
  const { theme, globalColors } = useTheme();

  const handlePress = () => {
    // Navigate to ingredient details
    console.log(`Pressed on ingredient: ${Name}`);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Halal':
        return 'check-circle';
      case 'Haram':
        return 'times-circle';
      case 'Unknown':
        return 'question-circle';
      default:
        return 'circle';
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
      <View className="p-3">
        <View className="flex-row justify-between items-start">
          <Text 
            className="font-medium text-lg flex-1" 
            style={{ color: theme.colors.textPrimary }}
          >
            {Name}
          </Text>
          <View 
            className="px-3 py-1 rounded-full flex-row items-center"
            style={{ 
              backgroundColor: `${getStatusColor(Status)}20`, // 20% opacity
            }}
          >
            <FontAwesome5 
              name={getStatusIcon(Status)} 
              size={12} 
              color={getStatusColor(Status)}
              style={{ marginRight: 4 }}
            />
            <Text 
              className="font-medium text-sm"
              style={{ color: getStatusColor(Status) }}
            >
              {Status}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center mt-2">
          <FontAwesome5 
            name="info-circle" 
            size={14} 
            color={theme.colors.textSecondary}
            style={{ marginRight: 6, opacity: 0.8 }}
          />
          <Text 
            className="text-sm" 
            style={{ color: theme.colors.textSecondary }}
          >
            {Source}
          </Text>
        </View>
        
        {/* Optional: We could add tags/categories here */}
      </View>
    </Pressable>
  );
};

export default Card;
