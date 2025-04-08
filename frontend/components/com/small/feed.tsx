import React, { useState, useRef } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  RefreshControl, 
  Animated, 
  StyleSheet,
  Pressable 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'themes/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from './Header'; // Import header component

// Define post type interface
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

// Define Comment and Response types to match PostDetail and CommentDetail
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

// Define navigation props
type RootStackParamList = {
  Feed: undefined;
  PostDetail: { post: Post };
  CommentDetail: { comment: Comment };
  Search: undefined;
  Notifications: undefined;
  UserProfile: { userId: string };
};

type FeedNavigationProp = StackNavigationProp<RootStackParamList>;

interface FeedProps {
  navigation: FeedNavigationProp;
}

// The blurhash for image placeholders
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// Enhanced Dummy Data
const posts: Post[] = [
  {
    id: '1',
    username: 'Ahmed Khan',
    handle: '@ahmedkhan',
    address: 'Los Angeles, CA',
    text: 'Checking the new halal restaurant in LA. The food was amazing and the service was excellent!',
    image:
      'https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    likes: 110,
    comments: 32,
    time: '2h ago',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '2',
    username: 'Jane Smith',
    handle: '@janesmith',
    address: 'New York',
    text: 'Loved the coffee at the new halal café in town! It\'s a great place to work and meet friends.',
    image:
      'https://images.unsplash.com/photo-1529676468696-f3a47aba7d5d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    profileImage: 'https://randomuser.me/api/portraits/women/72.jpg',
    likes: 56,
    comments: 12,
    time: '5h ago',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: '3',
    username: 'John Doe',
    handle: '@johndoe',
    address: 'San Francisco',
    text: 'Excited to try the new vegan bakery with halal certification! Their pastries look delicious.',
    image:
      'https://plus.unsplash.com/premium_photo-1687904479711-026c1c3abdf0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    likes: 200,
    comments: 75,
    time: '1d ago',
    isLiked: false,
    isBookmarked: true,
  },
];

const Feed: React.FC<FeedProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts);
  
  // Animated values for like and bookmark interactions
  const heartAnimations = useRef<{ [key: string]: Animated.Value }>(
    posts.reduce((acc, post) => ({ ...acc, [post.id]: new Animated.Value(post.isLiked ? 1 : 0) }), {})
  ).current;
  const bookmarkAnimations = useRef<{ [key: string]: Animated.Value }>(
    posts.reduce((acc, post) => ({ ...acc, [post.id]: new Animated.Value(post.isBookmarked ? 1 : 0) }), {})
  ).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch new data here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLike = (postId: string) => {
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          
          // Animate the heart
          Animated.sequence([
            Animated.timing(heartAnimations[postId], {
              toValue: 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(heartAnimations[postId], {
              toValue: newIsLiked ? 1 : 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleBookmark = (postId: string) => {
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newIsBookmarked = !post.isBookmarked;
          
          // Animate the bookmark
          Animated.sequence([
            Animated.timing(bookmarkAnimations[postId], {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(bookmarkAnimations[postId], {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          
          return {
            ...post,
            isBookmarked: newIsBookmarked,
          };
        }
        return post;
      })
    );
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile', { userId: '1' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header 
        showSearch={true}
        showNotification={true}
        showProfile={true}
        onSearchPress={handleSearchPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          {feedPosts.map((post) => (
            <Pressable 
              key={post.id} 
              onPress={() => navigation.navigate('PostDetail', { post })}
              style={({ pressed }) => [
                styles.postCard,
                {
                  backgroundColor: theme.colors.background,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                  marginBottom: 16,
                },
              ]}
            >
              {/* Post Header */}
              <View className="p-4">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: post.id })}>
                    <Image 
                      source={{ uri: post.profileImage }} 
                      style={{ height: 48, width: 48, borderRadius: 24 }}
                    />
                  </TouchableOpacity>
                  <View className="ml-3">
                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: post.id })}>
                      <Text 
                        className="font-semibold text-base" 
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {post.username}
                      </Text>
                      {post.handle && (
                        <Text 
                          className="text-xs" 
                          style={{ color: theme.colors.textMuted }}
                        >
                          {post.handle}
                        </Text>
                      )}
                    </TouchableOpacity>
                    <View className="flex-row items-center mt-1">
                      <Icon 
                        name="map-marker-alt" 
                        size={10} 
                        style={{ color: theme.colors.textMuted, marginRight: 4 }} 
                      />
                      <Text 
                        className="text-xs" 
                        style={{ color: theme.colors.textMuted }}
                      >
                        {post.address}
                      </Text>
                      <Text 
                        className="text-xs ml-3" 
                        style={{ color: theme.colors.textMuted }}
                      >
                        {post.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Post Content */}
              <View className="px-4 pb-3">
                <Text 
                  className="mb-3 text-sm leading-5" 
                  style={{ color: theme.colors.textPrimary }}
                  numberOfLines={3}
                >
                  {post.text}
                </Text>
              </View>

              {/* Post Image */}
              <Image 
                source={{ uri: post.image }} 
                style={{ width: '100%', height: 224, borderRadius: 8 }}
                resizeMode="cover"
              />

              {/* Post Footer */}
              <View className="p-4 flex-row justify-between items-center">
                <TouchableOpacity 
                  className="flex-row items-center" 
                  onPress={() => handleLike(post.id)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: heartAnimations[post.id],
                        },
                      ],
                    }}
                  >
                    <Icon 
                      name="heart" 
                      solid={post.isLiked}
                      size={18} 
                      style={{ 
                        color: post.isLiked ? theme.colors.primary : theme.colors.textMuted, 
                        marginRight: 6 
                      }}
                    />
                  </Animated.View>
                  <Text 
                    className="text-sm" 
                    style={{ color: theme.colors.textMuted }}
                  >
                    {post.likes}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="flex-row items-center"
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('PostDetail', { post })}
                >
                  <Icon 
                    name="comment" 
                    solid
                    size={18} 
                    style={{ color: theme.colors.accent, marginRight: 6 }} 
                  />
                  <Text 
                    className="text-sm" 
                    style={{ color: theme.colors.textMuted }}
                  >
                    {post.comments}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => handleBookmark(post.id)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: bookmarkAnimations[post.id],
                        },
                      ],
                    }}
                  >
                    <Icon 
                      name="bookmark" 
                      solid={post.isBookmarked}
                      size={18} 
                      style={{ 
                        color: post.isBookmarked ? theme.colors.accent : theme.colors.textMuted 
                      }} 
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
});

export default Feed;
