import React from 'react';
import { TextInput } from 'react-native';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <TextInput
      className="m-3 rounded-lg border-2 border-gray-300 p-3"
      placeholder="Search..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      cursorColor="#61A55D"
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
