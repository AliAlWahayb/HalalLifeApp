import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

// Dummy Data (with the new structure)
const posts = [
  {
    id: '1',
    username: 'UserName',
    address: 'Address',
    text: 'Checking the new halal restaurant in LA',
    image:
      'https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Post image (food)
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg', // User profile image
    likes: 110,
    comments: 32,
    time: '2h ago',
  },
  {
    id: '2',
    username: 'Jane Smith',
    address: 'New York',
    text: 'Loved the coffee at the new café in town!',
    image:
      'https://images.unsplash.com/photo-1529676468696-f3a47aba7d5d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Post image (coffee)
    profileImage: 'https://randomuser.me/api/portraits/women/72.jpg', // User profile image
    likes: 56,
    comments: 12,
    time: '5h ago',
  },
  {
    id: '3',
    username: 'John Doe',
    address: 'San Francisco',
    text: 'Excited to try the new vegan bakery!',
    image:
      'https://plus.unsplash.com/premium_photo-1687904479711-026c1c3abdf0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Post image (vegan)
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg', // User profile image
    likes: 200,
    comments: 75,
    time: '1d ago',
  },
];

const Feed = ({ navigation }) => {
  return (
    <ScrollView className="bg-gray-100 p-4">
      {posts.map((post) => (
        <TouchableOpacity key={post.id} onPress={() => navigation.navigate('PostDetail', { post })}>
          <View className="bg-background mb-4 rounded-lg p-4 shadow-lg">
            <View className="mb-2 flex-row items-center">
              {/* Display the user's profile image */}
              <Image source={{ uri: post.profileImage }} className="h-10 w-10 rounded-full" />
              <View className="ml-3">
                <Text className="font-semibold">{post.username}</Text>
                <Text className="text-textMuted text-sm">{post.address}</Text>
                <Text className="text-xs text-gray-400">{post.time}</Text>
              </View>
            </View>

            <Text className="mb-2 text-lg">{post.text}</Text>

            {/* Display the post image */}
            <Image source={{ uri: post.image }} className="mb-2 h-48 w-full rounded-lg" />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Icon name="thumbs-up" size={16} color="#4CAF50" />
                <Text className="ml-2 text-sm text-gray-600">{post.likes} Likes</Text>
              </View>
              <View className="flex-row items-center">
                <Icon name="comment" size={16} color="#2196F3" />
                <Text className="ml-2 text-sm text-gray-600">{post.comments} Comments</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Feed;
