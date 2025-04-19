import React from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  autoFocus = false,
}) => {
  const { theme } = useTheme();

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
    Keyboard.dismiss();
  };

  return (
    <View
      className="mx-4 my-3 flex-row items-center overflow-hidden rounded-xl border shadow-sm"
      style={{
        borderColor: theme.colors.textMuted,
        backgroundColor: theme.colors.background,
        shadowColor: theme.colors.textPrimary,
      }}>
      <View className="px-3 py-2">
        <FontAwesome5 name="search" size={18} color={theme.colors.primary} />
      </View>

      <TextInput
        className="flex-1 px-1 py-3 text-base"
        style={{
          color: theme.colors.textPrimary,
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        cursorColor={theme.colors.primary}
        maxLength={256}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
      />

      {value.length > 0 && (
        <TouchableOpacity
          className="px-3 py-2"
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome5 name="times-circle" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
