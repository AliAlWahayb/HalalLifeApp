import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
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
      className="flex-row items-center mx-4 my-3 rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: theme.colors.background, 
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="px-3 py-2">
        <FontAwesome5 name="search" size={18} color={theme.colors.primary} />
      </View>
      
      <TextInput
        className="flex-1 py-3 px-1"
        style={{ 
          color: theme.colors.textPrimary,
          fontSize: 16,
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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome5 name="times-circle" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
