import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from './Header';

// Define types
interface SavedPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
}

interface User {
  id: string;
  username: string;
  handle: string;
  bio: string;
  location: string;
  profileImage: string;
  followers: number;
  following: number;
  joinDate: string;
  savedPosts: SavedPost[];
  likedPosts: SavedPost[];
}

type RootStackParamList = {
  UserProfile: { userId: string };
  PostDetail: { post: any };
  Feed: undefined;
  EditProfile: undefined;
  UserSettings: undefined; // Change AccountSettings to UserSettings
  Preferences: undefined;
};

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;
type UserProfileNavigationProp = StackNavigationProp<RootStackParamList>;

interface UserProfileProps {
  route?: UserProfileRouteProp;
  navigation?: UserProfileNavigationProp;
}

// Sample user data
const dummyUser: User = {
  id: '1',
  username: 'Ahmed Khan',
  handle: '@ahmedkhan',
  bio: 'Passionate about halal food, culture and community. Food blogger and travel enthusiast.',
  location: 'Los Angeles, CA',
  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  followers: 1205,
  following: 345,
  joinDate: 'Joined March 2022',
  savedPosts: [
    {
      id: '1',
      image:
        'https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      likes: 110,
      comments: 32,
    },
    {
      id: '2',
      image:
        'https://images.unsplash.com/photo-1529676468696-f3a47aba7d5d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
      likes: 56,
      comments: 12,
    },
    {
      id: '3',
      image:
        'https://plus.unsplash.com/premium_photo-1687904479711-026c1c3abdf0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      likes: 200,
      comments: 75,
    },
  ],
  likedPosts: [
    {
      id: '4',
      image:
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      likes: 89,
      comments: 21,
    },
    {
      id: '5',
      image:
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
      likes: 134,
      comments: 42,
    },
  ],
};

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 48) / numColumns; // 48 = padding (16) * 3

const UserProfile = ({ route, navigation }: UserProfileProps) => {
  const [user] = useState<User>(dummyUser); // In a real app, fetch based on route.params.userId
  const [activeTab, setActiveTab] = useState<'saved' | 'liked'>('saved');
  const { theme } = useTheme();

  // Check if this is the user's own profile (in a real app, you would compare userId with currentUser.id)
  const isOwnProfile = true; // Hardcoded for now

  const showProfileOptions = () => {
    // In a real app, you might show an action sheet or modal here
    // For now, navigate directly to account settings
    navigation?.navigate('UserSettings');
  };

  const navigateToEditProfile = () => {
    navigation?.navigate('EditProfile');
  };

  const navigateToPreferences = () => {
    navigation?.navigate('Preferences');
  };

  const renderPostItem = ({ item }: { item: SavedPost }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => {
        // In a real app, you would fetch the full post data and navigate
        navigation?.navigate('PostDetail', {
          post: {
            id: item.id,
            image: item.image,
            // Add other required post fields here with placeholder data
            username: 'User',
            address: 'Location',
            text: 'Post content',
            profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
            likes: item.likes,
            comments: item.comments,
            time: '2h ago',
          },
        });
      }}>
      <Image
        source={{ uri: item.image }}
        style={[styles.postImage, { width: itemWidth }]}
        resizeMode="cover"
      />
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Icon name="heart" size={12} color="#fff" solid />
          <Text style={styles.statText}>{item.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="comment" size={12} color="#fff" solid />
          <Text style={styles.statText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        title={isOwnProfile ? 'Profile' : user.username}
        showBack={true}
        showSearch={false}
        showNotification={false}
        showProfile={false}
        customRightComponent={
          isOwnProfile ? (
            <TouchableOpacity style={styles.iconButton} onPress={showProfileOptions}>
              <Icon name="cog" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={[styles.username, { color: theme.colors.textPrimary }]}>
                {user.username}
              </Text>
              <Text style={[styles.handle, { color: theme.colors.textMuted }]}>{user.handle}</Text>
              <View style={styles.locationContainer}>
                <Icon
                  name="map-marker-alt"
                  size={12}
                  style={{ color: theme.colors.textMuted, marginRight: 4 }}
                />
                <Text style={[styles.locationText, { color: theme.colors.textMuted }]}>
                  {user.location}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.bio, { color: theme.colors.textPrimary }]}>{user.bio}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
                {user.followers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Followers</Text>
            </View>
            <View style={[styles.separator, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
                {user.following}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Following</Text>
            </View>
          </View>

          <Text style={[styles.joinDate, { color: theme.colors.textMuted }]}>{user.joinDate}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {isOwnProfile ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    {
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  onPress={navigateToEditProfile}>
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                    Edit Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.preferencesButton,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                  ]}
                  onPress={navigateToPreferences}>
                  <Text style={{ color: theme.colors.textPrimary }}>Preferences</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.followButton, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.messageButton,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                  ]}>
                  <Icon name="ellipsis-h" size={16} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: 'rgba(0,0,0,0.1)' }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'saved' && [
                styles.activeTab,
                { borderBottomColor: theme.colors.primary },
              ],
            ]}
            onPress={() => setActiveTab('saved')}>
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'saved' ? theme.colors.primary : theme.colors.textMuted },
              ]}>
              Bookmarked
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'liked' && [
                styles.activeTab,
                { borderBottomColor: theme.colors.primary },
              ],
            ]}
            onPress={() => setActiveTab('liked')}>
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'liked' ? theme.colors.primary : theme.colors.textMuted },
              ]}>
              Liked
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsContainer}>
          <FlatList
            data={activeTab === 'saved' ? user.savedPosts : user.likedPosts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            scrollEnabled={false}
            contentContainerStyle={styles.postGrid}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon
                  name="bookmark"
                  size={40}
                  color={theme.colors.textMuted}
                  style={{ marginBottom: 12 }}
                />
                <Text style={[styles.emptyStateText, { color: theme.colors.textMuted }]}>
                  {activeTab === 'saved' ? 'No bookmarked posts yet' : 'No liked posts yet'}
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  handle: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  separator: {
    width: 1,
    height: 24,
    marginHorizontal: 16,
  },
  joinDate: {
    fontSize: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  followButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  postGrid: {
    gap: 8,
  },
  postItem: {
    marginBottom: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    height: 150,
  },
  postStats: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  preferencesButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserProfile;
