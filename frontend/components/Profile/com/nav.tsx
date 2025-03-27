import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostPreview from 'components/Profile/com/PostPreview';
import profile from 'components/Profile/Profile';
const Stack = createStackNavigator();

const Nav = () => {
  return (
    
      <Stack.Navigator initialRouteName="profile">
        <Stack.Screen name="profile" component={profile} />
        <Stack.Screen name="PostPreview" component={PostPreview} />
      </Stack.Navigator> 
  );
};

export default Nav;
