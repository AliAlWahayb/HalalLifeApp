import { FlatList, View } from 'react-native';

import Card from './Components/Card';
import SearchBar from '../Componetnts/SearchBar';

const ProductsSearch = () => {
  const products = [
    {
      id: 1,
      Name: 'Namsadwadwsadwadwadsd',
      Source: 'Sousadwarce',
      Status: 'Halal',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 2,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 3,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Unknown',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 4,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 5,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 6,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 7,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 8,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 9,
      Name: 'Namsadwadwdwasdwadsd',
      Source: 'Sousadwarce',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <SearchBar />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card Name={item.Name} Source={item.Source} Status={item.Status} img={item.img} />
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
