import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Feed from './small/feed'; // Feed component
import PostDetail from './small/PostDetail'; // Post detail component
import CommentDetail from './small/CommentDetail'; // Comment detail component

const Stack = createStackNavigator();

const App = () => {
  return (
    
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="CommentDetail" component={CommentDetail} />
      </Stack.Navigator> 
  );
};

export default App;
