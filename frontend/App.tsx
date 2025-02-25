import './global.css';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';

import FakeView from './components/Home/FakeView';
import HomeView from './components/Home/HomeView';
import TopBar from 'components/Shared/components/Main/TopBar';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <TopBar />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#77C273',
            tabBarInactiveTintColor: '#0C0C0C',
            tabBarHideOnKeyboard: true,
            animation: 'fade',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              height: 70,
              paddingBottom: 5,
              paddingTop: 5,
            },
          }}
          initialRouteName="Home">
          <Tab.Screen
            name="Chat"
            component={HomeView}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="chat-processing-outline" size={24} color={color} />
              ),
              tabBarBadge: 3,
            }}
          />
          <Tab.Screen
            name="Map"
            component={FakeView}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="map-marker-outline" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Camera"
            component={FakeView}
            options={{
              tabBarLabel: '', // Remove label
              tabBarIcon: ({ color }) => (
                <View
                  style={{
                    backgroundColor: '#77C273',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: -10,
                    alignSelf: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <Text>
                    <Feather name="camera" size={32} color="white" />
                  </Text>
                </View>
              ),
              tabBarItemStyle: {
                height: 60,
              },
            }}
          />
          <Tab.Screen
            name="Search"
            component={HomeView}
            options={{
              tabBarIcon: ({ color }) => <Octicons name="search" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Home"
            component={HomeView}
            options={{
              tabBarIcon: ({ color }) => <Octicons name="home" size={24} color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
