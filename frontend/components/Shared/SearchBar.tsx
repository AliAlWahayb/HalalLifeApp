import React from 'react';
import { TextInput } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { theme } = useTheme();
  return (
    <TextInput
      className="m-3 rounded-lg border-2 border-gray-300 p-3"
      placeholder="Search..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      cursorColor={theme.colors.secondary}
      maxLength={256}
      clearButtonMode="always"
      keyboardType="default"
      enablesReturnKeyAutomatically
      enterKeyHint="search"
      returnKeyType="search"
    />
  );
};

export default SearchBar;
