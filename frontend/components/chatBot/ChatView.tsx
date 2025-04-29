import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

// Import components and types
import ChatAPI, { Message, ChatRequest } from './ChatAPI';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import { useTheme } from '../../themes/ThemeProvider';

const ChatView: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); // Keep this for future use
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imageProcessingStatus, setImageProcessingStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  
  // Use a default user ID for now
  const userId = 'anonymous';

  // Request camera permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
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

    // Add user message to the UI immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowWelcome(false);
    setImageProcessingStatus('idle');

    try {
      // Prepare the request
      const request: ChatRequest = {
        message: input || 'Analyze this image for halal ingredients',
        conversation_id: conversationId,
        image_data: currentImageData || undefined,
      };

      // Clear the image data after preparing the request
      setCurrentImageData(null);

      // Send to backend
      const response = await ChatAPI.sendMessage(request, userId);
      
      // Save conversation ID for future messages
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }
      
      // Add AI response to messages
      setMessages((prevMessages) => [...prevMessages, response.message]);
      
      // Update suggestions
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInput(suggestion);
    // Auto-send if it's a suggestion
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(undefined);
    setShowWelcome(true);
    setSuggestions([]);
  };

  const pickImage = async () => {
    // Request permissions if not already granted
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
        quality: 0.5, // Lower quality for smaller file size
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          // Format as data URL with compressed quality
          setCurrentImageData(`data:image/jpeg;base64,${asset.base64}`);
          console.log('Image picked with size:', asset.base64.length);
          setImageProcessingStatus('ready');
          
          // Add a default message to prompt the user
          setInput('Please analyze these ingredients for halal status');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const captureImage = async () => {
    if (!hasCameraPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant camera access to capture images.'
      );
      return;
    }

    // Navigate to a camera component or launch camera
    try {
      // Using expo-image-picker's camera option with compression
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Reduce quality to decrease file size
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          setCurrentImageData(`data:image/jpeg;base64,${asset.base64}`);
          console.log('Camera image captured with size:', asset.base64.length);
          setImageProcessingStatus('ready');
          
          // Add a default message to prompt the user
          setInput('Please analyze these ingredients for halal status');
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
  };

  const renderImagePreview = () => {
    if (!currentImageData) return null;
    
    return (
      <View style={styles.imagePreviewContainer}>
        <Image 
          source={{ uri: currentImageData }} 
          style={styles.imagePreview}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.clearImageButton}
          onPress={clearImageData}
        >
          <Ionicons name="close-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderImageStatus = () => {
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

  // Add input ref for focusing
  const inputRef = useRef<TextInput>(null);

  // Update inputContainer and related components in render
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#121212' }} // Darker background for better contrast
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Single main header with working back button */}
      <View style={styles.mainHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Halal Assistant</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Messages list */}
      {showWelcome && messages.length === 0 ? (
        <WelcomeScreen onSuggestionPress={handleSuggestionPress} />
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            style={styles.messagesContainer}
            data={messages}
            keyExtractor={(item, index) => `${item.id || index}`}
            renderItem={({ item, index }) => (
              <ChatMessage 
                message={item} 
                onSuggestionPress={handleSuggestionPress}
                suggestions={index === messages.length - 1 && item.role === 'assistant' ? suggestions : undefined}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No messages yet. Start a conversation!</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          

          {messages.length > 0 && (
            <View style={styles.floatingButtonContainer}>
              <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.newChatText}>New chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {isLoading && (
        <ActivityIndicator 
          style={styles.loadingIndicator} 
          size="large" 
          color="#4CAF50" // Green to match header
        />
      )}

      {/* Input area with image preview and status */}
      <View>
        {renderImagePreview()}
        {renderImageStatus()}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickImage}
          >
            <Ionicons name="image" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={captureImage}
          >
            <Ionicons name="camera" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Ask about ingredients..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: !input.trim() && !currentImageData ? '#2A3044' : '#4CAF50' }
            ]}
            onPress={handleSend}
            disabled={!input.trim() && !currentImageData}
          >
            <Ionicons name="send" size={20} color="white" />
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
    backgroundColor: '#121212', // Very dark background
  },
  mainHeader: {
    backgroundColor: '#4CAF50', // Green header background
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4, // Add shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
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
    color: '#AAAAAA', // Lighter grey for better visibility
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A', // Slightly lighter than background
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)', // Subtle separator
    alignItems: 'center',
    paddingBottom: 16, // More space at bottom
  },
  input: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Darker input field
    color: '#FFFFFF', // White text for visibility
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 120,
    fontSize: 16, // Larger font size
  },
  sendButton: {
    backgroundColor: '#4CAF50', // Green to match header
    borderRadius: 50,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  actionButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#2C2C2C', // Match input background
    borderRadius: 21,
  },
  loadingIndicator: {
    marginVertical: 16,
    alignSelf: 'center',
  },
  imagePreviewContainer: {
    margin: 12,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    height: 120, // Larger preview
    width: 120, // Larger preview
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  clearImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 14,
    padding: 4,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    zIndex: 10,
  },
  newChatButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)', // More opaque green
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.15)', // Light green background
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  imageStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  imageStatusText: {
    color: '#E0E0E0', // Light gray text
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});