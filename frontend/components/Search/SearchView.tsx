import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import IngredientsSearch from './IngredientsSearch/IngredientsSearch';
import ProductsSearch from './ProductsSearch/ProductsSearch';
import { useTheme } from 'themes/ThemeProvider';
import Halal from 'components/Products/Halal';
import Haram from 'components/Products/Haram';
import Unknown from 'components/Products/Unknown';
import NotFound from 'components/Products/NotFound';

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
        swipeEnabled: false,
      }}
      >
      <Tab.Screen name="Products" component={ProductsSearch} />
      <Tab.Screen name="Ingredients" component={IngredientsSearch} />
      <Tab.Screen name="Halal" component={Halal} />
      <Tab.Screen name="Haram" component={Haram} />
      <Tab.Screen name="Unknown" component={Unknown} />
      <Tab.Screen name="NotFound" component={NotFound} />
    </Tab.Navigator>
  );
};

export default SearchView;
