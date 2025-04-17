import ButtonsSmall from 'components/Shared/Buttons/ButtonsSmall';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from 'tailwind.config';
import { useTheme } from 'themes/ThemeProvider';

interface ContributorsProps {
  index: number;
  name: string;
  contributions: number;
  onPress: () => void;
  isLast?: boolean;
}

const Contributors = ({
  index,
  name,
  contributions,
  onPress,
  isLast = false,
}: ContributorsProps) => {
  const { theme } = useTheme();

  return (
    <View
      className={`flex-row items-center justify-between py-3 ${!isLast ? 'border-b' : ''}`}
      style={{
        borderBottomColor: `${theme.colors.textMuted}20`,
      }}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-9 w-9 items-center justify-center rounded-full"
          style={{
            backgroundColor: theme.colors.accent,
          }}>
          <Text
            className="font-bold"
            style={{
              color: index < 3 ? '#fff' : theme.colors.textSecondary,
            }}>
            {index}
          </Text>
        </View>
        <View>
          <Text
            className="text-base font-semibold"
            style={{
              color: theme.colors.textPrimary,
            }}>
            {name}
          </Text>
          <Text className="text-xs" style={{ color: theme.colors.textMuted }}>
            {contributions} contributions
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className="rounded-2xl px-4 py-1.5"
        style={{
          backgroundColor: theme.colors.accent,
        }}>
        <Text className="text-xs font-semibold" style={{ color: theme.colors.textSecondary }}>
          Follow
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Contributors;
