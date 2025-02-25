import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';


import BottomTab from 'components/Shared/components/Main/BottomTab';
import SideMenu from 'components/Shared/components/Main/SideMenu';


export default function App() {
  return (
    <>
      <NavigationContainer>
        <SideMenu />
        <BottomTab />
      </NavigationContainer>
    </>
  );
}
