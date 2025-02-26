import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';


import BottomTab from 'components/Shared/components/Main/BottomTab';
import SideMenu from 'components/Shared/components/Main/SideMenu';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <>
      <NavigationContainer>
        <BottomTab />
      </NavigationContainer>
    </>
  );
}
