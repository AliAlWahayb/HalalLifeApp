import { FontAwesome5 } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

import IngredientsSearch from './IngredientsSearch/IngredientsSearch';
import ProductsSearch from './ProductsSearch/ProductsSearch';
import SearchBar from '../Shared/SearchBar';

const Tab = createMaterialTopTabNavigator();

const SearchView = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // This will be shared with both tab components
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
      }}>
      {/* Header */}
      <View className="px-4 ">
        <Text className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
          Search
        </Text>
        <Text className="text-sm" style={{ color: theme.colors.textMuted }}>
          Find products and ingredients
        </Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search products or ingredients..."
      />

      {/* Filter Chips would go here */}

      {/* Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
          },
          tabBarItemStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          },
          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
            borderRadius: 3,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          swipeEnabled: true,
        }}>
        <Tab.Screen
          name="Products"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5
                name="shopping-bag"
                size={16}
                color={color}
                style={{ marginRight: 8 }}
              />
            ),
          }}>
          {() => <ProductsSearch searchQuery={searchQuery} />}
        </Tab.Screen>

        <Tab.Screen
          name="Ingredients"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="leaf" size={16} color={color} style={{ marginRight: 8 }} />
            ),
          }}>
          {() => <IngredientsSearch searchQuery={searchQuery} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default SearchView;
