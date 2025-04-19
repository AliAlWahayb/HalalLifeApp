import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Card from './Components/Card';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';

interface IngredientsSearchProps {
  searchQuery: string;
}

const IngredientsSearch: React.FC<IngredientsSearchProps> = ({ searchQuery }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([
    {
      id: 1,
      Name: 'Gelatin',
      Source: 'Animal-derived',
      Status: 'Haram',
    },
    {
      id: 2,
      Name: 'Citric Acid',
      Source: 'Synthetic/Plant',
      Status: 'Halal',
    },
    {
      id: 3,
      Name: 'Carmine',
      Source: 'Insect-derived',
      Status: 'Haram',
    },
    {
      id: 4,
      Name: 'Lecithin',
      Source: 'Soy/Egg',
      Status: 'Unknown',
    },
    {
      id: 5,
      Name: 'Mono and Diglycerides',
      Source: 'Animal/Plant',
      Status: 'Unknown',
    },
    {
      id: 6,
      Name: 'Vanilla Extract',
      Source: 'Plant-derived',
      Status: 'Halal',
    },
    {
      id: 7,
      Name: 'Ethyl Alcohol',
      Source: 'Fermentation',
      Status: 'Haram',
    },
    {
      id: 8,
      Name: 'Agar',
      Source: 'Seaweed',
      Status: 'Halal',
    },
    {
      id: 9,
      Name: 'L-Cysteine',
      Source: 'Human/Animal Hair',
      Status: 'Haram',
    },
  ]);

  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'source'

  // Filter statuses
  const filters = ['All', 'Halal', 'Haram', 'Unknown'];

  // Apply filters whenever search query or selected filter changes
  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let result = [...ingredients];

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
        result = result.filter((item) => item.Status === selectedFilter);
      }

      // Apply sorting
      if (sortBy === 'name') {
        result = [...result].sort((a, b) => a.Name.localeCompare(b.Name));
      } else if (sortBy === 'source') {
        result = [...result].sort((a, b) => a.Source.localeCompare(b.Source));
      }

      setFilteredIngredients(result);
      setLoading(false);
    }, 300);
  }, [searchQuery, selectedFilter, ingredients, sortBy]);

  const renderListHeader = () => {
    return (
      <View className="mb-2 px-2">
        <View className="mb-2 flex-row items-center justify-between px-2">
          <Text style={{ color: theme.colors.textPrimary }} className="text-base">
            {filteredIngredients.length} results
          </Text>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setSortBy(sortBy === 'name' ? 'source' : 'name')}>
            <FontAwesome5 name="sort" size={14} color={theme.colors.accent} />
            <Text style={{ color: theme.colors.accent }} className="ml-1">
              Sort by {sortBy === 'name' ? 'Source' : 'Name'}
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
                  className={`mr-2 rounded-full  px-4 py-2`}
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

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {renderListHeader()}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredIngredients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card Name={item.Name} Source={item.Source} Status={item.Status} />
          )}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 20,
            flexGrow: filteredIngredients.length === 0 ? 1 : undefined,
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

export default IngredientsSearch;
