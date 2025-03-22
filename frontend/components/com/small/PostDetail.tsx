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
  Modal,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const dummyComments = [
  {
    id: '1',
    username: 'User1',
    text: 'Looks delicious! Can’t wait to try it.',
    time: '1m ago',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    responses: [
      {
        id: '1-1',
        username: 'User2',
        text: 'I agree, it looks amazing!',
        time: '2m ago',
        profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        id: '1-2',
        username: 'User3',
        text: 'I’ll go there this weekend!',
        time: '5m ago',
        profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
    ],
  },
  {
    id: '2',
    username: 'User4',
    text: 'I’ve been there, it’s amazing!',
    time: '10m ago',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    responses: [],
  },
];

const PostDetail = ({ route, navigation }) => {
  const { post } = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [likes, setLikes] = useState(post.likes); // Initialize like state
  const [isLiked, setIsLiked] = useState(false); // Track if the post is liked

  const handleAddComment = () => {
    if (newComment.trim()) {
      alert(`New comment: ${newComment}`);
      setNewComment('');
    }
  };

  // Toggle full screen image modal visibility
  const toggleModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(!isModalVisible);
  };

  // Handle like button click
  const handleLike = () => {
    setIsLiked(!isLiked); // Toggle the like status
    setLikes(isLiked ? likes - 1 : likes + 1); // Update the like count
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView className="bg-gray-100 p-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-background mb-4 rounded-lg p-4 shadow-lg">
          {/* User Info */}
          <View className="mb-4 flex-row items-center">
            <Image source={{ uri: post.profileImage }} className="h-12 w-12 rounded-full" />
            <View className="ml-3">
              <Text className="font-semibold">{post.username}</Text>
              <Text className="text-textMuted text-sm">{post.address}</Text>
              <Text className="text-xs text-gray-400">{post.time}</Text>
            </View>
          </View>

          {/* Post Content */}
          <Text className="mb-2 text-lg">{post.text}</Text>

          {/* Post Image */}
          <TouchableOpacity onPress={() => toggleModal(post.image)}>
            <Image source={{ uri: post.image }} className="mb-2 h-48 w-full rounded-lg" />
          </TouchableOpacity>

          {/* Likes and Comments */}
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={handleLike} className="flex-row items-center">
              <Icon
                name={isLiked ? 'heart' : 'heart-o'}
                size={24}
                color={isLiked ? 'red' : 'gray'}
              />
              <Text className="ml-2 text-sm text-gray-600">{likes} Likes</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">{post.comments} Comments</Text>
          </View>

          {/* View Comments Button */}
          <Button
            title={isExpanded ? 'Hide Comments' : 'View Comments'}
            onPress={() => setIsExpanded(!isExpanded)}
          />
        </View>

        {/* TextInput to add a new comment */}
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

            {/* Comments Section */}
            <View className="mt-4">
              {dummyComments.map((comment) => (
                <View key={comment.id} className="mb-6">
                  {/* Root Comment Container as Touchable */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CommentDetail', { comment })}
                    style={{
                      backgroundColor: '#F9FAFB',
                      padding: 16,
                      borderRadius: 8,
                      shadowColor: '#000',
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 2 },
                    }}>
                    <View className="mb-2 flex-row items-center">
                      <Image
                        source={{ uri: comment.profileImage }}
                        className="h-12 w-12 rounded-full"
                      />
                      <View className="ml-3">
                        <Text className="text-lg font-semibold">{comment.username}</Text>
                        <Text className="text-textMuted text-sm">{comment.time}</Text>
                      </View>
                    </View>
                    <Text className="mt-2 text-base">{comment.text}</Text>
                    {/* Display number of responses */}
                    {comment.responses.length > 0 && (
                      <Text className="mt-2 text-sm text-blue-500">
                        {comment.responses.length} Responses
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal for Full Screen Image */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setIsModalVisible(false)}>
            <Icon name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#FF5C5C',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
});

export default PostDetail;
