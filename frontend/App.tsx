import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import Navigation from 'components/Navigation/Navigation';

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </>
  );
}
