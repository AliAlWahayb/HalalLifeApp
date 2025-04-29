import { FontAwesome5 } from '@expo/vector-icons';
import { useIngredientss, Ingredients } from 'hooks/useSearch';
import React, { useState, useEffect, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { GLOBAL_COLORS } from 'themes/themes';

import Card from './Components/Card';
const MemoizedCard = memo(Card); // Create a memoized version of your Card component

interface IngredientsSearchProps {
  searchQuery: string;
}

const IngredientsSearch: React.FC<IngredientsSearchProps> = ({ searchQuery }) => {
  const { theme } = useTheme();
  // Use the React Query hook to fetch data
  const { data: ingredientsData, isLoading, isError, error } = useIngredientss();

  const [filteredIngredients, setFilteredIngredients] = useState<Ingredients[]>([]); // Initialize with empty array
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'source'

  // Filter statuses
  const filters = ['All', 'Halal', 'Haram', 'Unknown'];

  const handleStatus = (status: number) => {
    if (status === 1) {
      return 'Halal';
    } else if (status === 2) {
      return 'Haram';
    } else {
      return 'Unknown';
    }
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

  // Apply filters and sorting whenever search query, selected filter, or fetched data changes
  useEffect(() => {
    // Only process if data is available and not currently loading
    if (ingredientsData) {
      let result = [...ingredientsData]; // Start with the fetched data

      // Apply search query filter
      if (searchQuery) {
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (selectedFilter && selectedFilter !== 'All') {
        result = result.filter((item) => handleStatus(item.id_status) === selectedFilter);
      }

      // Apply sorting
      if (sortBy === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'source') {
        // Ensure category is treated as string for comparison
        result = [...result].sort((a, b) => String(a.category).localeCompare(String(b.category)));
      }

      setFilteredIngredients(result);
    } else {
      // If data is not yet available, clear the filtered list
      setFilteredIngredients([]);
    }
  }, [searchQuery, selectedFilter, ingredientsData, sortBy]); // Depend on fetched data

  const renderListHeader = () => {
    return (
      <View className="mb-2 px-2">
        <View className="mb-2 flex-row items-center justify-between px-2">
          <Text style={{ color: theme.colors.textPrimary }} className="text-base">
            {filteredIngredients.length} results
          </Text>
          {/* <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setSortBy(sortBy === 'name' ? 'source' : 'name')}>
            <FontAwesome5 name="sort" size={14} color={theme.colors.accent} />
            <Text style={{ color: theme.colors.accent }} className="ml-1">
              Sort by {sortBy === 'name' ? 'Source' : 'Name'}
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
    // Show different empty states based on loading/error
    if (isLoading) {
      return null; // Don't show empty list message while loading
    }
    if (isError) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <FontAwesome5
            name="exclamation-circle" // Use an error icon
            size={50}
            color={GLOBAL_COLORS.Haram} // Use error color
            style={{ opacity: 0.8 }}
          />
          <Text style={{ color: GLOBAL_COLORS.Haram }} className="mt-4 text-center text-lg">
            Error loading ingredients
          </Text>
          <Text
            style={{ color: theme.colors.textMuted }}
            className="mt-1 max-w-[250px] text-center text-sm">
            {error?.message || 'An unexpected error occurred.'}
          </Text>
        </View>
      );
    }
    // Show no results found only when not loading and no error
    return (
      <View className="flex-1 items-center justify-center py-20">
        <FontAwesome5
          name="flask"
          size={50}
          color={theme.colors.textMuted}
          style={{ opacity: 0.5 }}
        />
        <Text style={{ color: theme.colors.textMuted }} className="mt-4 text-center text-lg">
          No ingredients found
        </Text>
        <Text
          style={{ color: theme.colors.textMuted }}
          className="mt-1 max-w-[250px] text-center text-sm">
          Try adjusting your search or filters to find what you're looking for
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {renderListHeader()}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredIngredients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <MemoizedCard
              Name={item.name}
              Source={item.category}
              Status={handleStatus(item.id_status)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 20,
            flexGrow: filteredIngredients.length === 0 && !isLoading && !isError ? 1 : undefined, // Allow flexGrow only when empty and not loading/error
          }}
          ListEmptyComponent={renderEmptyList}
          initialNumToRender={20} // Increased initial render count
          maxToRenderPerBatch={10} // Increased batch render count
          removeClippedSubviews // Keep this for performance
          showsVerticalScrollIndicator={false}
          // Add windowSize for better performance with large lists
          windowSize={21} // Render items 10 above and 10 below the visible area
        />
      )}
    </View>
  );
};

export default IngredientsSearch;
