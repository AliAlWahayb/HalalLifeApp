import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Header from './Header';

// Define types
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

type RootStackParamList = {
  Feed: undefined;
  PostDetail: { post: Post };
  CommentDetail: { comment: Comment };
};

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;
type PostDetailNavigationProp = StackNavigationProp<RootStackParamList>;

interface PostDetailProps {
  route: PostDetailRouteProp;
  navigation: PostDetailNavigationProp;
}

// Sample comments data
const dummyComments: Comment[] = [
  {
    id: '1',
    username: 'User1',
    text: "Looks delicious! Can't wait to try it.",
    time: '1m ago',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    likes: 5,
    responses: [
      {
        id: '1-1',
        username: 'User2',
        text: 'I agree, it looks amazing!',
        time: '2m ago',
        profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
        likes: 3,
      },
      {
        id: '1-2',
        username: 'User3',
        text: "I'll go there this weekend!",
        time: '5m ago',
        profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
        likes: 1,
      },
    ],
  },
  {
    id: '2',
    username: 'User4',
    text: "I've been there, it's amazing!",
    time: '10m ago',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    likes: 2,
    responses: [],
  },
  {
    id: '3',
    username: 'User5',
    text: 'The menu is quite limited, but the quality is outstanding.',
    time: '1h ago',
    profileImage: 'https://randomuser.me/api/portraits/women/14.jpg',
    likes: 0,
    responses: [
      {
        id: '3-1',
        username: 'User6',
        text: 'Yes, quality over quantity!',
        time: '30m ago',
        profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
        likes: 4,
      }
    ],
  },
];

const PostDetail: React.FC<PostDetailProps> = ({ route, navigation }) => {
  const { post } = route.params;
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [comments, setComments] = useState(dummyComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        username: 'You',
        text: newComment,
        time: 'Just now',
        profileImage: 'https://randomuser.me/api/portraits/men/31.jpg',
        likes: 0,
        responses: [],
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: (comment.likes || 0) + 1 };
        }
        return comment;
      })
    );
  };

  const navigateToCommentDetail = (comment: Comment) => {
    navigation.navigate('CommentDetail', { comment });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Header 
        title="Post"
        showBack={true}
        showSearch={false}
        showProfile={false}
      />
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Post Header */}
        <View className="p-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: post.id })}>
              <Image source={{ uri: post.profileImage }} className="w-12 h-12 rounded-full" />
            </TouchableOpacity>
            <View className="ml-3">
              <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: post.id })}>
                <Text style={{ color: theme.colors.textPrimary, fontWeight: '600', fontSize: 16 }}>
                  {post.username}
                </Text>
                <View className="flex-row items-center">
                  <Icon 
                    name="map-marker-alt" 
                    size={10} 
                    style={{ color: theme.colors.textMuted, marginRight: 4 }} 
                  />
                  <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>{post.address}</Text>
                  <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginLeft: 8 }}>
                    {post.time}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Post Image */}
        <TouchableOpacity activeOpacity={0.9} onPress={toggleModal}>
          <Image 
            source={{ uri: post.image }} 
            style={{ width: '100%', height: 300, resizeMode: 'cover' }} 
          />
        </TouchableOpacity>

        {/* Post Content */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row">
              <TouchableOpacity 
                onPress={handleLike} 
                className="flex-row items-center mr-4"
              >
                <Icon 
                  name={isLiked ? 'heart' : 'heart'} 
                  solid={isLiked}
                  size={18} 
                  style={{ color: isLiked ? theme.colors.primary : theme.colors.textMuted, marginRight: 6 }} 
                />
                <Text style={{ color: theme.colors.textMuted, fontSize: 14 }}>{likes}</Text>
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Icon 
                  name="comment" 
                  solid
                  size={18} 
                  style={{ color: theme.colors.accent, marginRight: 6 }} 
                />
                <Text style={{ color: theme.colors.textMuted, fontSize: 14 }}>
                  {comments.length}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Icon 
                name="share" 
                size={18} 
                style={{ color: theme.colors.textMuted }} 
              />
            </TouchableOpacity>
          </View>

          <Text style={{ color: theme.colors.textPrimary, fontSize: 16, marginBottom: 16 }}>
            {post.text}
          </Text>
          
          {/* Comment Input */}
          <View 
            className="flex-row items-center mb-6" 
            style={{ 
              backgroundColor: theme.colors.background, 
              padding: 12, 
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.textMuted}
              style={{ 
                flex: 1, 
                color: theme.colors.textPrimary,
                fontSize: 14,
              }}
              multiline
            />
            <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
              <Icon 
                name="paper-plane" 
                size={18} 
                style={{ 
                  color: newComment.trim() ? theme.colors.primary : theme.colors.textMuted 
                }} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Comments Section */}
          <View className="pt-2">
            <Text 
              style={{ 
                color: theme.colors.textPrimary, 
                fontWeight: '600', 
                fontSize: 16, 
                marginBottom: 12 
              }}
            >
              Comments
            </Text>
            {comments.map((comment) => (
              <View 
                key={comment.id} 
                className="pb-4 mb-4" 
                style={{ 
                  borderBottomWidth: 1, 
                  borderBottomColor: '#E5E5E5'
                }}
              >
                <View className="flex-row mb-2">
                  <Image 
                    source={{ uri: comment.profileImage }} 
                    className="w-8 h-8 rounded-full"
                  />
                  <View 
                    className="flex-1 p-3 ml-3 rounded-2xl" 
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                        {comment.username}
                      </Text>
                      <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                        {comment.time}
                      </Text>
                    </View>
                    <Text style={{ color: theme.colors.textPrimary }}>
                      {comment.text}
                    </Text>
                  </View>
                </View>
                <View className="flex-row mt-1 ml-12">
                  <TouchableOpacity 
                    className="flex-row items-center mr-4"
                    onPress={() => handleCommentLike(comment.id)}
                  >
                    <Icon 
                      name="heart" 
                      size={12} 
                      style={{ color: theme.colors.textMuted, marginRight: 4 }} 
                    />
                    <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                      {comment.likes || 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => navigateToCommentDetail(comment)}
                  >
                    <Icon 
                      name="reply" 
                      size={12} 
                      style={{ color: theme.colors.textMuted, marginRight: 4 }} 
                    />
                    <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                      Reply
                      {comment.responses.length > 0 && ` (${comment.responses.length})`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <Pressable 
          className="items-center justify-center flex-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          onPress={toggleModal}
        >
          <TouchableOpacity 
            className="absolute z-10 p-2 top-12 right-5" 
            onPress={toggleModal}
          >
            <Icon name="times" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Image
            source={{ uri: post.image }}
            style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
          />
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;
