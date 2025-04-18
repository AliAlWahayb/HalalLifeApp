import { FlatList, TextInput, View } from 'react-native';

import Card from './Components/Card';
import { useState } from 'react';
import SearchBar from '../../Shared/SearchBar';
const products = [
  {
    id: 1,
    Name: 'Namsadwadwsadwadwadsd',
    Source: 'Sousadwarce',
    Status: 'Halal',
  },
  {
    id: 2,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
  {
    id: 3,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Unknown',
  },
  {
    id: 4,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
  {
    id: 5,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
  {
    id: 6,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
  {
    id: 7,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
  {
    id: 8,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
  {
    id: 9,
    Name: 'Namsadwadwdwasdwadsd',
    Source: 'Sousadwarce',
    Status: 'Haram',
  },
];
const ProductsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="bg-background flex-1">
      <SearchBar />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card Name={item.Name} Source={item.Source} Status={item.Status} />
        )}
        contentContainerStyle={{ alignItems: 'center' }}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        removeClippedSubviews
      />
    </View>
  );
};

export default ProductsSearch;
