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
      countries_en: 'United States,World',
      code: 727806011220,
      image_url: null,
      product_name: 'Eggplant Cutlets',
      brands: 'Dominex, Dominex Natural Foods',
      Status: 'Halal',
    },
    {
      countries_en: 'United States',
      code: 78354703915,
      image_url:
        'https://images.openfoodfacts.org/images/products/007/835/470/3915/front_en.3.400.jpg',
      product_name: 'Lite 50 sharp cheddar shredded cheese',
      brands: null,
      Status: 'Halal',
    },
  ]);

  const subtext = (text1: string, text2: string) => {
    if (!text1) return text2;
    return text1 + ', ' + text2;
  };

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
            item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subtext(item.brands || '', item.countries_en || '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (selectedFilter && selectedFilter !== 'All') {
        result = result.filter((item) => item.Status === selectedFilter);
      }

      setFilteredProducts(result);
      setLoading(false);
    }, 300);
  }, [searchQuery, selectedFilter, products]);

  const renderListHeader = () => {
    return (
      <View className="m-2 px-2">
        <View className="mb-2 flex-row items-center justify-between px-2">
          <Text style={{ color: theme.colors.textPrimary }} className="text-base">
            {filteredProducts.length} results
          </Text>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => console.log('Sort pressed')}>
            <FontAwesome5 name="sort" size={14} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.accent }} className="ml-1">
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
                  className={`mr-2 rounded-full px-4 py-2 `}
                  style={{
                    backgroundColor: isSelected ? theme.colors.accent : 'transparent',
                  }}>
                  <Text
                    style={{
                      color: isSelected ? theme.colors.background : theme.colors.textPrimary,
                    }}
                    className="font-medium">
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
    <View className="flex-1 items-center justify-center py-20">
      <FontAwesome5
        name="search"
        size={50}
        color={theme.colors.textMuted}
        style={{ opacity: 0.5 }}
      />
      <Text style={{ color: theme.colors.textMuted }} className="mt-4 text-center text-lg">
        No products found
      </Text>
      <Text
        style={{ color: theme.colors.textMuted }}
        className="mt-1 max-w-[250px] text-center text-sm">
        Try adjusting your search or filters to find what you're looking for
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {renderListHeader()}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card
              Name={item.product_name}
              Source={subtext(item.brands || '', item.countries_en || '')}
              Status={item.Status}
              img={item.image_url}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 20,
            flexGrow: filteredProducts.length === 0 ? 1 : undefined,
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
