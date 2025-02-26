/* eslint-disable import/order */
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Entypo } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

import HomeView from 'components/Home/HomeView';

const Drawer = createDrawerNavigator();

export default function SideMenu() {
  const IconSize = 28;
  const color = 'white';

  return (
    <SafeAreaView className="flex-1">
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
          drawerPosition: 'right',
          drawerType: 'front',
          drawerActiveBackgroundColor: '#61A55D',
          drawerStyle: {
            width: '60%',
            height: '37%',
            backgroundColor: '#77C273',
            borderRadius: 25,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          drawerLabelStyle: {
            color: '#fff',
          },
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
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        })}>
        <Drawer.Screen
          name="History"
          component={HomeView}
          options={{
            drawerLabel: () => null,
            drawerIcon: () => (
              <View className="flex flex-row items-center justify-center gap-3 ">
                <Octicons name="history" size={IconSize} color={color} />
                <Text className="font-bold text-white">History</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Preferences"
          component={HomeView}
          options={{
            drawerLabel: () => null,
            drawerIcon: () => (
              <View className="flex flex-row items-center justify-center gap-3 ">
                <FontAwesome5 name="allergies" size={IconSize} color={color} />
                <Text className="font-bold text-white">Preferences</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Favorites"
          component={HomeView}
          options={{
            drawerLabel: () => null,
            drawerIcon: () => (
              <View className="ms-2 flex flex-row items-center justify-center gap-3 ">
                <Fontisto name="favorite" size={IconSize} color={color} />
                <Text className="font-bold text-white">Favorites</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="User Settings"
          component={HomeView}
          options={{
            drawerLabel: () => null,
            drawerIcon: () => (
              <View className="flex flex-row items-center justify-center gap-3 ">
                <FontAwesome5 name="user-alt" size={IconSize} color={color} />
                <Text className="font-bold text-white">User Settings</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Theme"
          component={HomeView}
          options={{
            drawerLabel: () => null,
            drawerIcon: () => (
              <View className="flex flex-row items-center justify-center gap-3 ">
                <MaterialIcons name="color-lens" size={IconSize} color={color} />
                <Text className="font-bold text-white">Theme</Text>
              </View>
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}
