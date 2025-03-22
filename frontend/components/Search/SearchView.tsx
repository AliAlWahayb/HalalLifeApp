import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import IngredientsSearch from './IngredientsSearch/IngredientsSearch';
import ProductsSearch from './ProductsSearch/ProductsSearch';
import { useTheme } from 'themes/ThemeProvider';

const Tab = createMaterialTopTabNavigator();

const SearchView = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.textSecondary, shadowColor: 'transparent' },
        tabBarItemStyle: { width: 'auto' },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30,
        },
        tabBarIndicatorStyle: { display: 'none' },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}>
      <Tab.Screen name="Products" component={ProductsSearch} />
      <Tab.Screen name="Ingredients" component={IngredientsSearch} />
    </Tab.Navigator>
  );
};

export default SearchView;
