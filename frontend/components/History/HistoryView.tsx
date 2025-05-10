import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Card from './Components/Card';
import { useFocusEffect } from '@react-navigation/native';
import Buttons from 'components/Shared/Buttons/AliButtons';
import ButtonsSmall from 'components/Shared/Buttons/ButtonsSmall';
import { Product } from 'hooks/useSearch';

const MemoizedCard = memo(Card);

const subtext = (text1: string | null | undefined, text2: string | null | undefined) => {
  const parts = [];
  if (text1) parts.push(text1);
  if (text2) parts.push(text2);
  return parts.join(', ');
};

const HistoryView: React.FC = () => {
  const { theme } = useTheme();
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filters = ['All', 'Halal', 'Haram', 'Unknown'];

  useFocusEffect(
    React.useCallback(() => {
      const fetchHistory = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const productDataArray = await AsyncStorage.multiGet(keys);
          const products = productDataArray
            .map(([key, value]) => {
              try {
                if (key === 'anonymous_user_id') {
                  return null;
                }

                if (value) {
                  const parsedValue = JSON.parse(value);
                  if (parsedValue && parsedValue.code) {
                    return {
                      code: parsedValue.code,
                      product_name: parsedValue.product.product_name,
                      brands: parsedValue.product.brands,
                      countries_en: parsedValue.product.countries,
                      halal_status: parsedValue.halal_analysis.halal_status,
                      image_url: parsedValue.product.image_url,
                      additives: parsedValue.product.additives_tags || [],
                      ingredients: parsedValue.product.ingredients_text || 'N/A',
                    };
                  }
                }
              } catch (parseError) {
                console.error(`Error parsing JSON for key ${key}:`, parseError);
              }
              return null;
            })
            .filter(Boolean);

          const uniqueProducts = Array.from(
            new Map(products.map((product) => [product?.code, product])).values()
          );

          setHistoryProducts(uniqueProducts);
          setFilteredProducts(uniqueProducts);
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      };

      fetchHistory();
    }, []) // Empty dependency array to ensure effect runs only on focus
  );

  useEffect(() => {
    if (selectedFilter && selectedFilter !== 'All') {
      setFilteredProducts(
        historyProducts.filter(
          (item) => item.halal_status?.toLowerCase() === selectedFilter.toLowerCase()
        )
      );
    } else {
      setFilteredProducts(historyProducts);
    }
  }, [selectedFilter, historyProducts]);

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear(); // Clears all keys and values in AsyncStorage
      console.log('AsyncStorage cleared!');
      // Reset state to trigger a re-render and clear the history list
      setHistoryProducts([]); // Reset historyProducts
      setFilteredProducts([]); // Reset filteredProducts
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const renderListHeader = () => (
    <View className="m-2 px-2">
      <View className="mb-2 flex-row items-center justify-between px-2">
        <Text style={{ color: theme.colors.textPrimary }} className="text-base">
          {filteredProducts.length} results
        </Text>
        <ButtonsSmall title="Clear All" onPress={clearAllData} />
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
                  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
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

  const renderEmptyHistory = () => (
    <View className="flex-1 items-center justify-center py-20">
      <FontAwesome5
        name="history"
        size={50}
        color={theme.colors.textMuted}
        style={{ opacity: 0.5 }}
      />
      <Text className="mt-4 text-center text-lg" style={{ color: theme.colors.textMuted }}>
        No history found
      </Text>
      <Text
        className="mt-1 max-w-[250px] text-center text-sm"
        style={{ color: theme.colors.textMuted }}>
        Your viewed products will appear here.
      </Text>
    </View>
  );

  const keyExtractor = (item, index) => `${item.code}-${index}`;

  const renderItem = ({ item }) => {
    if (!item.halal_status || item.halal_status === 'not found') {
      return null; // Skip rendering if halal_status is not found
    }

    return (
      <MemoizedCard
        Name={item.product_name}
        Source={subtext(item.brands, item.countries_en)}
        Status={item.halal_status}
        img={item.image_url}
        code={item.code}
        additives={item.additives}
        ingredients={item.ingredients}
      />
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {renderListHeader()}

      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 20,
          flexGrow: filteredProducts.length === 0 ? 1 : undefined,
        }}
        ListEmptyComponent={renderEmptyHistory}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HistoryView;
