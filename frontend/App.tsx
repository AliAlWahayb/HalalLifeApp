/* eslint-disable import/order */
import NavigationView from 'components/Navigation/NavigationView';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ThemeProvider } from 'themes/ThemeProvider';
import { withTheme } from 'util/withTheme';

import { AuthProvider } from 'components/context/Auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();


// Wrap your Navigation component with theme HOC
const ThemedNavigation = withTheme(NavigationView);

export default function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <ThemedNavigation />
          </NavigationContainer>
        </ThemeProvider>
       </AuthProvider>
    </QueryClientProvider>
  );
}

