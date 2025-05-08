import { FontAwesome5 } from '@expo/vector-icons';
import { useInfiniteProducts, Product } from 'hooks/useSearch';
import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { GLOBAL_COLORS } from 'themes/themes';

import Card from './Components/Card'; // Create a memoized version of your Card component

const MemoizedCard = memo(Card);

interface ProductsSearchProps {
  searchQuery: string;
}

const ProductsSearch: React.FC<ProductsSearchProps> = ({ searchQuery }) => {
  const { theme, globalColors } = useTheme();

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts();

  const allProducts: Product[] = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const subtext = (text1: string | null | undefined, text2: string | null | undefined) => {
    const parts = [];
    if (text1) parts.push(text1);
    if (text2) parts.push(text2);
    return parts.join(', ');
  };

  const handleFilterColor = (filter: string) => {
    if (filter === 'All') {
      return theme.colors.primary;
    } else if (filter === 'Halal') {
      return GLOBAL_COLORS.Halal;
    } else if (filter === 'Haram') {
      return GLOBAL_COLORS.Haram;
    } else if (filter === 'Unknown') {
      return GLOBAL_COLORS.Unknown;
    } else {
      return theme.colors.textMuted;
    }
  };

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filters = ['All', 'Halal', 'Haram', 'Unknown'];

  useEffect(() => {
    if (allProducts) {
      let result = [...allProducts];

      if (searchQuery) {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
        result = result.filter(
          (item) =>
            item.product_name?.toLowerCase().includes(lowerCaseSearchQuery) ||
            (subtext(item.brands, item.countries_en) || '')
              .toLowerCase()
              .includes(lowerCaseSearchQuery)
        );
      }

      if (selectedFilter && selectedFilter !== 'All') {
        // Filter based on the halal_status property from the hook data
        result = result.filter(
          (item) => item.halal_status?.toLowerCase() === selectedFilter.toLowerCase()
        );
      }

      setFilteredProducts(result);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, selectedFilter, allProducts]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="items-center justify-center py-5">
          <ActivityIndicator size="small" color={theme.colors.accent} />
        </View>
      );
    }
    return null;
  };

  const renderListHeader = () => {
    return (
      <View className="m-2 px-2">
        <View className="mb-2 flex-row items-center justify-between px-2">
          <Text style={{ color: theme.colors.textPrimary }} className="text-base">
            {filteredProducts.length} results
          </Text>
          {/* <TouchableOpacity
            className="flex-row items-center"
            onPress={() => console.log('Sort pressed')}>
            <FontAwesome5 name="sort" size={14} color={theme.colors.accent} />
            <Text style={{ color: theme.colors.accent }} className="ml-1">
              Sort
            </Text>
          </TouchableOpacity> */}
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
                  className="mr-2 rounded-full px-4 py-2"
                  style={{
                    backgroundColor: isSelected ? handleFilterColor(item) : 'transparent',
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

  const renderEmptyList = () => {
    if (isLoading) {
      return null;
    }
    if (isError) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <FontAwesome5
            name="exclamation-circle"
            size={50}
            color={globalColors.Haram}
            style={{ opacity: 0.8 }}
          />
          <Text className="mt-4 text-center text-lg" style={{ color: globalColors.Haram }}>
            Error loading products
          </Text>
          <Text
            className="mt-1 max-w-[250px] text-center text-sm"
            style={{ color: theme.colors.textMuted }}>
            {error?.message || 'An unexpected error occurred.'}
          </Text>
        </View>
      );
    }
    if (filteredProducts.length === 0 && !isLoading && !isError) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <FontAwesome5
            name="search"
            size={50}
            color={theme.colors.textMuted}
            style={{ opacity: 0.5 }}
          />
          <Text className="mt-4 text-center text-lg" style={{ color: theme.colors.textMuted }}>
            No products found
          </Text>
          <Text
            className="mt-1 max-w-[250px] text-center text-sm"
            style={{ color: theme.colors.textMuted }}>
            Try adjusting your search or filters to find what you're looking for
          </Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text className="mt-2" style={{ color: theme.colors.textPrimary }}>
          Loading products...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {renderListHeader()}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.code.toString()}
        renderItem={({ item }) => {
          if (!item.image_url) {
            return null;
          }
          if (!item.product_name) {
            return null;
          }
          return (
            <MemoizedCard
              Name={item.product_name}
              Source={subtext(item.brands, item.countries_en)}
              Status={item.halal_status || 'unknown'}
              img={item.image_url}
              code={item.code}
            />
          );
        }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 20,
          flexGrow: filteredProducts.length === 0 && !isLoading && !isError ? 1 : undefined,
        }}
        ListEmptyComponent={renderEmptyList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        removeClippedSubviews
        windowSize={21}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductsSearch;
