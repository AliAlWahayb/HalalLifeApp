/* eslint-disable import/order */
import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons, Feather, Octicons, Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import FakeView from 'components/Home/FakeView';
import HomeView from 'components/Home/HomeView';
import SideMenu from './SideMenu';
import FakeMenu from 'components/SideMenu/FakeMenu';
import Information from 'components/Information/Information';
import Scanner from 'components/Camera/Scanner';
import SearchView from 'components/Search/SearchView';
import Preference from 'components/Preference/Preference';
import Theme from 'components/Theme/ThemeView';

import comView from 'components/com/comView';
import Halal from 'components/Products/Halal';
import Haram from 'components/Products/Haram';
import ReportView from 'components/Report/ReportView';
import { useTheme } from 'themes/ThemeProvider';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const IconSize = 28;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const { theme, themeName } = useTheme();

  return (
    <View className={`theme-${themeName} flex-1`}>
      {/* Pass modalVisible and setModalVisible to SideMenu */}
      <SideMenu modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: () => null,
          headerStyle: {
            minHeight: 100,
          },
          headerLeft: () => (
            <MaterialCommunityIcons
              name="information-variant"
              size={IconSize + 5}
              color={theme.colors.textPrimary}
              className="p-5"
              // @ts-ignore
              onPress={() => navigation.navigate('Information')}
            />
          ),
          headerRight: () => (
            <Entypo
              name="menu"
              size={IconSize + 5}
              color={theme.colors.textPrimary}
              className="p-5"
              onPress={() => setModalVisible(true)}
            />
          ),
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textPrimary,
          tabBarHideOnKeyboard: true,
          animation: 'fade',
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}
        initialRouteName="Map">
        <Tab.Screen
          name="Chat"
          component={comView}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="chat-processing-outline" size={24} color={color} />
            ),
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen
          name="Map"
          component={Theme}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="map-marker-outline" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={Scanner}
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
                <Text>
                  <Feather name="camera" size={32} color={theme.colors.textSecondary} />
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
          component={SearchView}
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
        {/* screen for the side menu */}
        <Tab.Screen
          name="History"
          component={SearchView}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Preferences"
          component={Preference}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={SearchView}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="User settings"
          component={FakeMenu}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Theme"
          component={Theme}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        {/* screen for the Information */}
        <Tab.Screen
          name="Information"
          component={Information}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTab;
