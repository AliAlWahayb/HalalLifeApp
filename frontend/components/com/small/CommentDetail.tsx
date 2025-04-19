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
  Alert,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
  responses: Response[];
}

type RootStackParamList = {
  CommentDetail: { comment: Comment };
  UserProfile: { userId: string };
};

type CommentDetailRouteProp = RouteProp<RootStackParamList, 'CommentDetail'>;
type CommentDetailNavigationProp = StackNavigationProp<RootStackParamList>;

interface CommentDetailProps {
  route: CommentDetailRouteProp;
  navigation: CommentDetailNavigationProp;
}

const CommentDetail: React.FC<CommentDetailProps> = ({ route, navigation }) => {
  const { comment } = route.params;
  console.log('Comment in CommentDetail:', comment); // Debug log to check received data
  
  const [newResponse, setNewResponse] = useState('');
  const [responses, setResponses] = useState(comment.responses || []);
  const { theme } = useTheme();

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      const newResponseObj: Response = {
        id: `response-${Date.now()}`,
        username: 'You',
        text: newResponse,
        time: 'Just now',
        profileImage: 'https://randomuser.me/api/portraits/men/31.jpg',
        likes: 0,
      };
      setResponses([newResponseObj, ...responses]);
      setNewResponse('');
      
      // Show a temporary success message
      Alert.alert('Response Added', 'Your response has been added successfully');
    }
  };

  const handleLike = (responseId: string) => {
    setResponses(
      responses.map((response) => {
        if (response.id === responseId) {
          return { ...response, likes: response.likes + 1 };
        }
        return response;
      })
    );
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Header 
        title="Responses"
        showBack={true}
        showSearch={false}
        showNotification={false}
      />
      
      <ScrollView className="flex-1 p-4">
        {/* Original Comment */}
        <View 
          className="p-4 mb-6 rounded-xl" 
          style={{ 
            backgroundColor: theme.colors.background,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
          }}
        >
          <View className="flex-row items-center mb-3">
            <TouchableOpacity onPress={() => handleUserPress(comment.id)}>
              <Image 
                source={{ uri: comment.profileImage }} 
                className="h-10 w-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="ml-3">
              <TouchableOpacity onPress={() => handleUserPress(comment.id)}>
                <Text style={{ color: theme.colors.textPrimary, fontWeight: '600' }}>
                  {comment.username}
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                  {comment.time}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 16, lineHeight: 22 }}>
            {comment.text}
          </Text>
        </View>

        {/* Response Input */}
        <View 
          className="flex-row items-center mb-6" 
          style={{ 
            backgroundColor: theme.colors.background, 
            padding: 12, 
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <TextInput
            value={newResponse}
            onChangeText={setNewResponse}
            placeholder="Add a response..."
            placeholderTextColor={theme.colors.textMuted}
            style={{ 
              flex: 1, 
              color: theme.colors.textPrimary,
              fontSize: 14,
              paddingVertical: 4,
            }}
            multiline
          />
          <TouchableOpacity 
            onPress={handleAddResponse} 
            disabled={!newResponse.trim()}
          >
            <Icon 
              name="paper-plane" 
              size={18} 
              style={{ 
                color: newResponse.trim() ? theme.colors.primary : theme.colors.textMuted 
              }} 
            />
          </TouchableOpacity>
        </View>

        {/* Responses Section Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text 
            style={{ 
              color: theme.colors.textPrimary, 
              fontWeight: '600', 
              fontSize: 16,
            }}
          >
            Responses {responses.length > 0 && `(${responses.length})`}
          </Text>
          
          {responses.length > 0 && (
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary, fontSize: 14 }}>
                Latest
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Responses List */}
        {responses.length > 0 ? (
          <View>
            {responses.map((response) => (
              <View 
                key={response.id} 
                className="mb-4 ml-4 pb-4" 
                style={{ 
                  borderBottomWidth: 1, 
                  borderBottomColor: '#E5E5E5' 
                }}
              >
                <View className="flex-row">
                  <TouchableOpacity onPress={() => handleUserPress(response.id)}>
                    <Image 
                      source={{ uri: response.profileImage }} 
                      className="h-8 w-8 rounded-full" 
                    />
                  </TouchableOpacity>
                  <View 
                    className="flex-1 ml-3 p-3 rounded-xl" 
                    style={{ 
                      backgroundColor: theme.colors.background,
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <TouchableOpacity onPress={() => handleUserPress(response.id)}>
                        <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                          {response.username}
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                        {response.time}
                      </Text>
                    </View>
                    <Text style={{ color: theme.colors.textPrimary }}>
                      {response.text}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => handleLike(response.id)} 
                  className="flex-row items-center mt-2 ml-12"
                >
                  <Icon 
                    name="heart" 
                    size={12} 
                    solid={response.likes > 0}
                    style={{ 
                      color: response.likes > 0 ? theme.colors.primary : theme.colors.textMuted,
                      marginRight: 4 
                    }} 
                  />
                  <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                    {response.likes} {response.likes === 1 ? 'Like' : 'Likes'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-8">
            <Icon 
              name="comment-dots" 
              size={32} 
              style={{ color: theme.colors.textMuted, marginBottom: 12 }} 
            />
            <Text style={{ color: theme.colors.textMuted, textAlign: 'center' }}>
              No responses yet. Be the first to respond!
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CommentDetail;
