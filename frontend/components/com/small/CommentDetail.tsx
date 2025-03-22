import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

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
      style={{ flex: 1 }}>
      <ScrollView className="bg-gray-100 p-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-background mb-4 rounded-lg p-4 shadow-lg">
          {/* Comment Info */}
          <View className="mb-2 flex-row items-center">
            <Image source={{ uri: comment.profileImage }} className="h-10 w-10 rounded-full" />
            <View className="ml-3">
              <Text className="font-semibold">{comment.username}</Text>
              <Text className="text-textMuted text-sm">{comment.time}</Text>
            </View>
          </View>
          <Text className="mt-2">{comment.text}</Text>

          {/* Add a response */}
          <View className="mt-4">
            <TextInput
              value={newResponse}
              onChangeText={setNewResponse}
              placeholder="Add a response..."
              className="mt-4 rounded-lg border border-gray-300 p-2"
              multiline
            />
            <TouchableOpacity
              onPress={handleAddResponse}
              className="mt-2 rounded-lg bg-blue-500 p-2">
              <Text className="text-background text-center">Post Response</Text>
            </TouchableOpacity>
          </View>

          {/* Responses Section */}
          <View className="mt-4">
            {comment.responses.map((response) => (
              <View key={response.id} className="mb-4">
                <View className="mb-2 flex-row items-center">
                  <Image
                    source={{ uri: response.profileImage }}
                    className="h-10 w-10 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="font-semibold">{response.username}</Text>
                    <Text className="text-textMuted text-sm">{response.time}</Text>
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
