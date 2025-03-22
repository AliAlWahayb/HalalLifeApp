import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import IngredientsSearch from './IngredientsSearch/IngredientsSearch';
import ProductsSearch from './ProductsSearch/ProductsSearch';

const Tab = createMaterialTopTabNavigator();

const SearchView = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: 'white', shadowColor: 'transparent' },
        tabBarItemStyle: { width: 'auto' },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30,
        },
        tabBarIndicatorStyle: { display: 'none' },
        tabBarActiveTintColor: '#77C273',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Products" component={ProductsSearch} />
      <Tab.Screen name="Ingredients" component={IngredientsSearch} />
    </Tab.Navigator>
  );
};

export default SearchView;
