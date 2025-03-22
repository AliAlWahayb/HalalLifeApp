import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from 'components/Navigation/Navigation';
import React from 'react';
import { ThemeProvider } from 'themes/ThemeProvider';
import { withTheme } from 'util/withTheme';

// Wrap your Navigation component with theme HOC
const ThemedNavigation = withTheme(Navigation);

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <ThemedNavigation />
      </NavigationContainer>
    </ThemeProvider>
  );
}
