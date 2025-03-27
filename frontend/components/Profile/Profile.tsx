import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Image } from 'expo-image';
import profileImg from '../../assets/Profile/profile-icon.png';
import postImg from '../../assets/Profile/profile-icon.png';
import ProfileCard from '../Profile/com/ProfileCard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserSettings from 'components/UserSettings/UserSettings';
import { useTheme } from 'themes/ThemeProvider';
import PostCard from './com/PostCard';
import PostPreview from './com/PostPreview';

const Tab = createMaterialTopTabNavigator();


const Profile = () => {
  

  const profileData = {
    name: 'Abdullah Alsaiahti',
    location: 'Dammam, Saudi Arabia',
    bio: 'CS Student at IAU',
    followers: 65,
    photos: 34,
    following: 21,
    img: profileImg,
  };
  


  return (
    <View className='flex-1 bg-background'>

      <View className='px mt-2'>

      <ProfileCard {...profileData}/>
      <PostCard 
        name = 'Abdullah Alsaiahti'
        avatar={profileImg}
        content="Sample post"
        postImage={postImg}
      />
      
      

      </View>


    </View>


  );
};
const ProfileNav = () => {
   const { theme } = useTheme();
  return (

        <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.accent,
          },
          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 30,
          },
          swipeEnabled: false,
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: 'gray', 
          tabBarStyle: {
            backgroundColor: 'white', 
          },
        }}
        >

          <Tab.Screen name="Profile Info" component={Profile} />
          <Tab.Screen name="Edit Profile" component={UserSettings} />
     

        </Tab.Navigator>
 
  );
};

export default ProfileNav;

