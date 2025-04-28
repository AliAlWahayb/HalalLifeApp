/* eslint-disable import/order */
import { View, Text, Platform } from 'react-native';
import React, { useState, useMemo, useCallback, memo ,useContext} from 'react';
import { MaterialCommunityIcons, Feather, Octicons, Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import HomeView from 'components/Home/HomeView';
import SideMenu from './SideMenu';
import Information from 'components/Information/Information';
import SearchView from 'components/Search/SearchView';
import Preference from 'components/Preference/Preference';
import Theme from 'components/Theme/ThemeView';
import comView from 'components/com/comView';
import mapView from 'components/map/mapView';
import { useTheme } from 'themes/ThemeProvider';
import UserSettings from 'components/UserSettings/UserSettings';
import CameraView from 'components/Camera/CameraView';
import UserProfile from 'components/com/small/UserProfile';
import ProtectedScreen from 'components/Shared/ProtectedScreen/ProtectedScreen';
import { AuthContext } from '../../context/Auth-context';

const Tab = createBottomTabNavigator();



// Create placeholder components for screens that don't exist yet
const NotificationsScreen = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: 18 }}>Notifications Screen</Text>
      <Text style={{ color: theme.colors.textSecondary, marginTop: 10 }}>
        This is a placeholder for the notifications screen
      </Text>
    </View>
  );
};

// Use the existing UserProfile component for the Profile screen
const ProfileScreen = UserProfile;


interface TabBarIconProps {
  color: string;
}

const BottomTab: React.FC = () => {
  const IconSize = 28;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { theme, themeName } = useTheme();

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const navigateToInformation = useCallback(() => {
    // @ts-ignore - we know this navigation route exists
    navigation.navigate('Navigation', { screen: 'Information' });
  }, [navigation]);

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      headerTitle: () => null,
      headerStyle: {
        minHeight: Platform.OS === 'ios' ? 88 : 50,
        backgroundColor: theme.colors.background,
      },
      headerLeft: () => (
        <MaterialCommunityIcons
          name="information-variant"
          size={IconSize + 5}
          color={theme.colors.textPrimary}
          className="p-5"
          onPress={navigateToInformation}
        />
      ),
      headerRight: () => (
        <Entypo
          name="menu"
          size={IconSize + 5}
          color={theme.colors.textPrimary}
          className="p-5"
          onPress={toggleModal}
        />
      ),
      tabBarActiveTintColor: theme.colors.accent,
      tabBarInactiveTintColor: theme.colors.textPrimary,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        height: Platform.OS === 'ios' ? 88 : 75,
        paddingBottom: Platform.OS === 'ios' ? 28 : 5,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500' as const,
        marginTop: 3,
        marginBottom: Platform.OS === 'ios' ? 5 : 3,
      },
    }),
    [IconSize, navigateToInformation, theme.colors, toggleModal]
  );

  const ChatIcon = useCallback(
    ({ color }: TabBarIconProps) => (
      <MaterialCommunityIcons name="chat-processing-outline" size={24} color={color} />
    ),
    []
  );

  const MapIcon = useCallback(
    ({ color }: TabBarIconProps) => (
      <MaterialCommunityIcons name="map-marker-outline" size={24} color={color} />
    ),
    []
  );

  const SearchIcon = useCallback(
    ({ color }: TabBarIconProps) => <Octicons name="search" size={24} color={color} />,
    []
  );

  const HomeIcon = useCallback(
    ({ color }: TabBarIconProps) => <Octicons name="home" size={24} color={color} />,
    []
  );

  const CameraIcon = useCallback(
    () => (
      <View
        style={{
          backgroundColor: theme.colors.accent,
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          bottom: Platform.OS === 'ios' ? -8 : -10,
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
    [theme.colors.accent, theme.colors.textSecondary]
  );
  const auth = useContext(AuthContext);
  const isPhoneOnlyUser = auth.authType === 'phone';
  return (
    <View className={`theme-${themeName} flex-1`}>
      {/* Pass modalVisible and setModalVisible to SideMenu */}
      <SideMenu modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <Tab.Navigator screenOptions={screenOptions} initialRouteName="Camera">
        <Tab.Screen
          name="Chat"
          component={comView}
          options={{
            tabBarIcon: ChatIcon,
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen
          name="Map"
          component={mapView}
          options={{
            tabBarIcon: MapIcon,
          }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraView}
          options={{
            tabBarLabel: '',
            tabBarIcon: CameraIcon,
            tabBarItemStyle: {
              height: 60,
            },
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchView}
          options={{
            tabBarIcon: SearchIcon,
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeView}
          options={{
            tabBarIcon: HomeIcon,
          }}
        />
        {/* screen for the side menu */}
        <Tab.Screen
          name="History"
          options={{
          tabBarItemStyle: { display: 'none' },
          }}
          >
         {() => (
           <ProtectedScreen>
              <SearchView />
          </ProtectedScreen>
             )}
           </Tab.Screen>

           <Tab.Screen
            name="Preferences"
            options={{
           tabBarItemStyle: { display: 'none' },
           }}
          >
           {() => (
            <ProtectedScreen>
            <Preference />
           </ProtectedScreen>
           )}
          </Tab.Screen>

           <Tab.Screen
             name="Favorites"
             options={{
             tabBarItemStyle: { display: 'none' },
             }}
          >
          {() => (
          <ProtectedScreen>
           <SearchView />
         </ProtectedScreen>
          )}
         </Tab.Screen>

        
         <Tab.Screen
          name="UserSettings"
          options={{
          tabBarItemStyle: { display: 'none' },
           }}
          >
         {() => (
         <ProtectedScreen>
         <UserSettings />
         </ProtectedScreen>
           )}
         </Tab.Screen>
         

        
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
        {/* Add Profile and Notifications screens */}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default memo(BottomTab);
