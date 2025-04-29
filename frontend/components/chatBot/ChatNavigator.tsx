import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatView from './ChatView';

const Stack = createStackNavigator();

const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the Stack Navigator header
      }}
    >
      <Stack.Screen
        name="ChatView"
        component={ChatView}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;