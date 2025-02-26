/* eslint-disable import/order */
import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons, Feather, Octicons, Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FakeView from 'components/Home/FakeView';
import HomeView from 'components/Home/HomeView';
import SideMenu from './SideMenu';

const Tab = createBottomTabNavigator();



const BottomTab = () => {
  const IconSize = 28;
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility

  return (
    <>
      {/* Pass modalVisible and setModalVisible to SideMenu */}
      <SideMenu modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: () => null,
          headerLeft: () => (
            <MaterialCommunityIcons
              name="information-variant"
              size={IconSize + 5}
              color="black"
              className="p-5"
              onPress={() => console.log('test')}
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
    </>
  );
};

export default BottomTab;
