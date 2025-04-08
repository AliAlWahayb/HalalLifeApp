import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

// Import all components
import AccountSettings from './small/AccountSettings';
import CommentDetail from './small/CommentDetail';
import EditProfile from './small/EditProfile';
import Header from './small/Header';
import Notifications from './small/Notifications';
import PostDetail from './small/PostDetail';
import Preferences from './small/Preferences';
import Search from './small/Search';
import UserProfile from './small/UserProfile';
import Feed from './small/feed';

// Define the types for responses and comments
interface Response {
  id: string;
  username: string;
  text: string;
  time: string;
  profileImage: string;
  likes: number;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  time: string;
  profileImage: string;
  likes?: number;
  responses: Response[];
}

// Define post type
interface Post {
  id: string;
  username: string;
  handle?: string;
  address: string;
  text: string;
  image: string;
  profileImage: string;
  likes: number;
  comments: number;
  time: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// Define the type for our stack navigator params
export type RootStackParamList = {
  Feed: undefined;
  PostDetail: { post: any };
  CommentDetail: { comment: any };
  UserProfile: { userId: string };
  Notifications: undefined;
  Search: undefined;
  EditProfile: undefined;
  AccountSettings: undefined;
  Preferences: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Custom header title component
const HalalLifeTitle = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: theme.colors.primary,
        }}>
        Halal<Text style={{ color: theme.colors.textPrimary }}>Life</Text>
      </Text>
    </View>
  );
};

const ComView: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="Feed"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="CommentDetail" component={CommentDetail} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="AccountSettings" component={AccountSettings} />
        <Stack.Screen name="Preferences" component={Preferences} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ComView;
