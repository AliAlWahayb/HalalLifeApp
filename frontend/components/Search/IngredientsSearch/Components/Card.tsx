import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';

interface CardProps {
  Name: string;
  Source: string | null;
  Status: string;
}

const Card: React.FC<CardProps> = ({ Name, Source, Status }) => {
  const { theme, globalColors } = useTheme();

  const handlePress = () => {
    // Navigate to ingredient details
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
          borderWidth: 1,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
      ]}>
      <View className="p-3">
        <View className="flex-row items-start justify-between ">
          <Text className="flex-1 text-lg font-medium" style={{ color: theme.colors.textPrimary }}>
            {Name}
          </Text>
          <View
            className="flex-row items-center rounded-full px-3 py-1"
            style={{
              backgroundColor: `${getStatusColor(Status)}`,
            }}>
            <Text className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
              {Status}
            </Text>
          </View>
        </View>

        <View className="mt-2 flex-row items-center">
          <FontAwesome5
            name="info-circle"
            size={14}
            color={Source ? theme.colors.textMuted : theme.colors.textMuted}
            style={{ marginRight: 6, opacity: 0.8 }}
          />
          <Text className="text-sm" style={{ color: theme.colors.textMuted }}>
            {Source || 'N/A'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Card;
