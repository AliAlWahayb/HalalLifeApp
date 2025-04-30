import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatAPI, { Message, ChatRequest } from './ChatAPI';
import ChatMessage from './ChatMessage';
import { useTheme } from '../../themes/ThemeProvider';

const ChatView: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    { content: 'Hello! How can I assist you today?', role: 'assistant' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imageProcessingStatus, setImageProcessingStatus] = useState<
    'idle' | 'processing' | 'ready'
  >('idle');

  const userId = 'anonymous';

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !currentImageData) return;

    const userMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date(),
      image_data: currentImageData || undefined,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setImageProcessingStatus('idle');

    try {
      const request: ChatRequest = {
        message: input || (currentImageData ? 'Analyze this image' : ''),
        conversation_id: conversationId,
        image_data: currentImageData || undefined,
      };

      const response = await ChatAPI.sendMessage(request, userId);

      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      setMessages((prevMessages) => [...prevMessages, response.message]);
      setSuggestions(response.suggestions || []);

      // Clear image data only after successful API response
      setCurrentImageData(null);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        content:
          'Sorry, I encountered an error while processing your request. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      // Keep image data if sending failed, allow user to retry
      setImageProcessingStatus('ready'); // Indicate image is still attached
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant access to your photo library to upload images.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          setCurrentImageData(`data:image/jpeg;base64,${asset.base64}`);
          setImageProcessingStatus('ready');
          if (!input.trim()) {
            setInput('Please analyze this image for halal ingredients');
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const captureImage = async () => {
    if (!hasCameraPermission) {
      Alert.alert('Permission Required', 'Please grant camera access to capture images.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          setCurrentImageData(`data:image/jpeg;base64,${asset.base64}`);
          setImageProcessingStatus('ready');
          if (!input.trim()) {
            setInput('Please analyze this image for halal ingredients');
          }
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const clearImageData = () => {
    setCurrentImageData(null);
    setImageProcessingStatus('idle');
    if (input === 'Please analyze this image for halal ingredients') {
      setInput('');
    }
  };

  const renderImagePreview = () => {
    if (!currentImageData) return null;

    return (
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: currentImageData }} style={styles.imagePreview} resizeMode="cover" />
        <TouchableOpacity style={styles.clearImageButton} onPress={clearImageData}>
          <Ionicons name="close-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderImageStatus = () => {
    return null;
    // eslint-disable-next-line no-unreachable
    if (imageProcessingStatus === 'idle' || !currentImageData) return null;

    return (
      <View style={styles.imageStatusContainer}>
        {imageProcessingStatus === 'processing' && (
          <View style={styles.imageStatusRow}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.imageStatusText}>Preparing image...</Text>
          </View>
        )}
        {imageProcessingStatus === 'ready' && (
          <View style={styles.imageStatusRow}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.imageStatusText}>
              Image ready to send. Edit message if needed and press send.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const inputRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}>
      {/* Adjusted keyboardVerticalOffset */}

      <FlatList
        ref={flatListRef}
        style={styles.messagesContainer}
        data={messages}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={({ item, index }) => (
          <ChatMessage
            message={item}
            onSuggestionPress={handleSuggestionPress}
            suggestions={
              index === messages.length - 1 && item.role === 'assistant' ? suggestions : undefined
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }} // Add padding to see last message above input
      />

      {isLoading && (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4CAF50" />
      )}

      {/* {messages.length > 0 && ( // Show New Chat button if there are messages
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
            <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.newChatText}>New chat</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.background, // Input area background
          paddingBottom: insets.bottom, // Use insets for bottom padding
          paddingHorizontal: 10,
          paddingTop: 5,
        }}>
        {renderImagePreview()}
        {renderImageStatus()}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.textSecondary, // Input row background
            borderRadius: 25,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginBottom: 10, // Space below input row
          }}>
          <TouchableOpacity onPress={pickImage} style={{ marginRight: 10 }}>
            <Ionicons name="image" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={captureImage} style={{ marginRight: 10 }}>
            <Ionicons name="camera" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={{ flex: 1, color: theme.colors.textPrimary, maxHeight: 120 }} // Limit input height
            placeholder="Type a message"
            placeholderTextColor={theme.colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{ marginLeft: 10 }}
            disabled={(!input.trim() && !currentImageData) || isLoading}>
            <Ionicons
              name="send"
              size={24}
              color={
                (!input.trim() && !currentImageData) || isLoading
                  ? theme.colors.textMuted
                  : theme.colors.accent
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 16,
    alignSelf: 'center',
  },
  imagePreviewContainer: {
    margin: 8, // Smaller margin
    position: 'relative',
    borderRadius: 8, // Smaller border radius
    overflow: 'hidden',
    height: 80, // Smaller preview
    width: 80, // Smaller preview
    alignSelf: 'flex-start', // Align left
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 5, // Space below preview
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  clearImageButton: {
    position: 'absolute',
    top: 3, // Adjusted position
    right: 3, // Adjusted position
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12, // Smaller border radius
    padding: 2, // Smaller padding
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    zIndex: 10,
  },
  newChatButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newChatText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  imageStatusContainer: {
    paddingHorizontal: 10, // Smaller padding
    paddingVertical: 6, // Smaller padding
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    marginHorizontal: 5, // Smaller margin
    marginBottom: 8,
    borderRadius: 8,
    alignSelf: 'flex-start', // Align left
  },
  imageStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, // Smaller margin
  },
  imageStatusText: {
    color: '#E0E0E0',
    fontSize: 12, // Smaller font size
    marginLeft: 5, // Smaller margin
    flex: 1,
  },
});
