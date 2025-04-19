import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Entypo, Feather, Octicons } from '@expo/vector-icons';
import { useTheme } from 'themes/ThemeProvider';

const Tab = createBottomTabNavigator();

const FakeView = () => <View />;

const BottomTabShowcase = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => null,
        headerStyle: {
          minHeight: 100,
        },
        headerLeft: () => (
          <Entypo
            name="info-with-circle"
            size={30}
            color={theme.colors.textPrimary}
            style={{ paddingLeft: 15 }}
            onPress={() => alert('This is a showcase app.')}
          />
        ),
        headerRight: () => (
          <Entypo
            name="menu"
            size={30}
            color={theme.colors.textPrimary}
            style={{ paddingRight: 15 }}
            onPress={() => alert('This is a showcase app.')}
          />
        ),
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textPrimary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}>
      <Tab.Screen
        name="Chat"
        component={FakeView}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat-processing-outline" size={24} color={color} />
          ),
          tabBarBadge: 3, // Showcase with a badge
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
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: theme.colors.accent,
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
              <Feather name="camera" size={32} color={theme.colors.textSecondary} />
            </View>
          ),
          tabBarItemStyle: {
            height: 60,
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={FakeView}
        options={{
          tabBarIcon: ({ color }) => <Octicons name="search" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={FakeView}
        options={{
          tabBarIcon: ({ color }) => <Octicons name="home" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabShowcase;
