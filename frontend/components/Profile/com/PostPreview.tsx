import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const dummyPost = {
  username: 'Abdullah Alsaiahti',
  address: 'Dammam, Saudi Arabia',
  text: 'Sample halal post!',
  image: require('../../../assets/Products/post.jpg'),
  profileImage: require('../../../assets/Profile/profile-icon.png'),
  likes: 123,
  comments: 10,
  time: '2h ago',
};

const dummyComments = [
  {
    id: '1',
    username: 'User1',
    text: 'Looks delicious! Can’t wait to try it.',
    time: '1m ago',
    profileImage: require('../../../assets/Profile/profile-icon.png'),
    responses: [
      {
        id: '1-1',
        username: 'User2',
        text: 'I agree, it looks amazing!',
        time: '2m ago',
        profileImage: require('../../../assets/Profile/profile-icon.png'), 
      },
    ],
  },
];

const PostPreview = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(dummyPost.likes);

  const handleAddComment = () => {
    if (newComment.trim()) {
      alert(`New comment: ${newComment}`);
      setNewComment('');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView className="bg-gray-100 p-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-background mb-4 rounded-lg p-4 shadow-lg">
          
          <View className="mb-4 flex-row items-center">
            <Image source={dummyPost.profileImage} className="h-12 w-12 rounded-full" />
            <View className="ml-3">
              <Text className="font-semibold">{dummyPost.username}</Text>
              <Text className="text-textMuted text-sm">{dummyPost.address}</Text>
              <Text className="text-xs text-gray-400">{dummyPost.time}</Text>
            </View>
          </View>

          
          <Text className="mb-2 text-lg">{dummyPost.text}</Text>

          
          <Image source={dummyPost.image} className="mb-2 h-48 w-full rounded-lg" />

          
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={handleLike} className="flex-row items-center">
              <Icon
                name={isLiked ? 'heart' : 'heart-o'}
                size={24}
                color={isLiked ? 'red' : 'gray'}
              />
              <Text className="ml-2 text-sm text-gray-600">{likes} Likes</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">{dummyPost.comments} Comments</Text>
          </View>

          <Button
            title={isExpanded ? 'Hide Comments' : 'View Comments'}
            onPress={() => setIsExpanded(!isExpanded)}
          />
        </View>

        {isExpanded && (
          <>
            <View className="bg-background mb-4 rounded-lg p-4">
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                className="mt-4 rounded-lg border border-gray-300 p-2"
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                className="mt-2 rounded-lg bg-blue-500 p-2">
                <Text className="text-textSecondary text-center">Post Comment</Text>
              </TouchableOpacity>
            </View>

           
            <View className="mt-4">
              {dummyComments.map((comment) => (
                <View
                  key={comment.id}
                  style={{
                    backgroundColor: '#F9FAFB',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}>
                  <View className="mb-2 flex-row items-center">
                    <Image
                      source={comment.profileImage}
                      className="h-12 w-12 rounded-full"
                    />
                    <View className="ml-3">
                      <Text className="text-lg font-semibold">{comment.username}</Text>
                      <Text className="text-textMuted text-sm">{comment.time}</Text>
                    </View>
                  </View>
                  <Text className="mt-2 text-base">{comment.text}</Text>
                  {comment.responses.length > 0 && (
                    <Text className="mt-2 text-sm text-blue-500">
                      {comment.responses.length} Responses
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PostPreview;
