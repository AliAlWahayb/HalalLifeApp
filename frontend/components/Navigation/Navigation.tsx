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
import Haram from 'components/Products/Haram';

import comView from 'components/com/comView';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const IconSize = 28;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <>
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
              color="black"
              className="p-5"
              // @ts-ignore
              onPress={() => navigation.navigate('Information')}
            />
          ),
          headerRight: () => (
            <Entypo
              name="menu"
              size={IconSize + 5}
              color="black"
              className="p-5"
              onPress={() => setModalVisible(true)}
            />
          ),
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
        initialRouteName="Search">
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
          component={FakeView}
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
          component={Haram}
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
          component={FakeMenu}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Preferences"
          component={FakeMenu}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FakeMenu}
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
          component={FakeMenu}
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
    </>
  );
};

export default BottomTab;
