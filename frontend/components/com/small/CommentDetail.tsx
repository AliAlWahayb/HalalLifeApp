import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const CommentDetail = ({ route }) => {
  const { comment } = route.params; // Get comment data from params
  const [newResponse, setNewResponse] = useState('');

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      alert(`New response: ${newResponse}`);
      setNewResponse('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView className="bg-gray-100 p-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-white rounded-lg shadow-lg mb-4 p-4">
          {/* Comment Info */}
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: comment.profileImage }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="font-semibold">{comment.username}</Text>
              <Text className="text-sm text-gray-500">{comment.time}</Text>
            </View>
          </View>
          <Text className="mt-2">{comment.text}</Text>

          {/* Add a response */}
          <View className="mt-4">
            <TextInput
              value={newResponse}
              onChangeText={setNewResponse}
              placeholder="Add a response..."
              className="border border-gray-300 rounded-lg p-2 mt-4"
              multiline
            />
            <TouchableOpacity
              onPress={handleAddResponse}
              className="bg-blue-500 rounded-lg p-2 mt-2"
            >
              <Text className="text-white text-center">Post Response</Text>
            </TouchableOpacity>
          </View>

          {/* Responses Section */}
          <View className="mt-4">
            {comment.responses.map((response) => (
              <View key={response.id} className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Image
                    source={{ uri: response.profileImage }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="font-semibold">{response.username}</Text>
                    <Text className="text-sm text-gray-500">{response.time}</Text>
                  </View>
                </View>
                <Text className="mt-2">{response.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CommentDetail;
