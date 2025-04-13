import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Card from './Components/Card';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';

interface ProductsSearchProps {
  searchQuery: string;
}

const ProductsSearch: React.FC<ProductsSearchProps> = ({ searchQuery }) => {
  const { theme, globalColors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      Name: 'Organic Almond Milk',
      Source: 'Silk',
      Status: 'Halal',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 2,
      Name: 'BBQ Potato Chips',
      Source: 'Lays',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 3,
      Name: 'Vanilla Ice Cream',
      Source: 'Ben & Jerry\'s',
      Status: 'Unknown',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 4,
      Name: 'Vegan Protein Bar',
      Source: 'RXBAR',
      Status: 'Halal',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 5,
      Name: 'Chocolate Cookies',
      Source: 'Nabisco',
      Status: 'Haram',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 6,
      Name: 'Coconut Water',
      Source: 'Vita Coco',
      Status: 'Halal',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 7,
      Name: 'Strawberry Yogurt',
      Source: 'Chobani',
      Status: 'Unknown',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 8,
      Name: 'Wheat Bread',
      Source: 'Wonder',
      Status: 'Halal',
      img: require('../../../assets/Products/image.png'),
    },
    {
      id: 9,
      Name: 'Cola Drink',
      Source: 'Coca-Cola',
      Status: 'Halal',
      img: require('../../../assets/Products/image.png'),
    },
  ]);
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Filter statuses
  const filters = ['All', 'Halal', 'Haram', 'Unknown'];
  
  // Apply filters whenever search query or selected filter changes
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let result = [...products];
      
      // Apply search query filter
      if (searchQuery) {
        result = result.filter(
          (item) => 
            item.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.Source.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply status filter
      if (selectedFilter && selectedFilter !== 'All') {
        result = result.filter(item => item.Status === selectedFilter);
      }
      
      setFilteredProducts(result);
      setLoading(false);
    }, 300);
  }, [searchQuery, selectedFilter, products]);

  const renderListHeader = () => {
    return (
      <View className="px-2 mb-2">
        <View className="flex-row justify-between items-center px-2 mb-2">
          <Text style={{ color: theme.colors.textPrimary }} className="text-base">
            {filteredProducts.length} results
          </Text>
          <TouchableOpacity 
            className="flex-row items-center" 
            onPress={() => console.log('Sort pressed')}
          >
            <FontAwesome5 name="sort" size={14} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary }} className="ml-1">
              Sort
            </Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row pb-2">
          <FlatList
            horizontal
            data={filters}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selectedFilter === item || (!selectedFilter && item === 'All');
              return (
                <TouchableOpacity
                  onPress={() => setSelectedFilter(item === 'All' ? null : item)}
                  className={`px-4 py-2 rounded-full mr-2 border`}
                  style={{
                    backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    borderColor: theme.colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? theme.colors.background : theme.colors.textPrimary,
                    }}
                    className="font-medium"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-20">
      <FontAwesome5 
        name="search" 
        size={50} 
        color={theme.colors.textMuted} 
        style={{ opacity: 0.5 }}
      />
      <Text 
        style={{ color: theme.colors.textMuted }} 
        className="mt-4 text-lg text-center"
      >
        No products found
      </Text>
      <Text 
        style={{ color: theme.colors.textMuted }} 
        className="mt-1 text-sm text-center max-w-[250px]"
      >
        Try adjusting your search or filters to find what you're looking for
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {renderListHeader()}
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card 
              Name={item.Name} 
              Source={item.Source} 
              Status={item.Status} 
              img={item.img} 
            />
          )}
          contentContainerStyle={{ 
            paddingHorizontal: 12,
            paddingBottom: 20,
            flexGrow: filteredProducts.length === 0 ? 1 : undefined 
          }}
          ListEmptyComponent={renderEmptyList}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductsSearch;
