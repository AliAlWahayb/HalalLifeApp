import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Animated,
  Modal,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../themes/ThemeProvider';
import ModernChatMessage from './ModernChatMessage';
import ModernWelcomeScreen from './ModernWelcomeScreen';

// Define message types
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageContentType = 'text' | 'image';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  contentType?: 'text' | 'image'; // Add contentType to distinguish between text and image messages
  imageUri?: string; // Add imageUri for image messages
}

// Options for voice, clarity, etc.
type ModelOption = 'standard' | 'concise' | 'detailed';

const ModernChatView: React.FC = () => {
  const { theme, themeName } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [model, setModel] = useState<ModelOption>('standard');
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Define high contrast colors
  const headerIconColor = themeName === 'dark' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(0, 0, 0, 0.7)';
  
  const inputPlaceholderColor = themeName === 'dark'
    ? 'rgba(255, 255, 255, 0.5)'
    : 'rgba(0, 0, 0, 0.4)';
  
  const modalOverlayColor = 'rgba(0, 0, 0, 0.7)'; // Darker overlay for better contrast

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Monitor scroll position to show/hide scroll to bottom button
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;
        
        // Show button if we're not at the bottom and have enough content
        const isNotAtBottom = scrollPosition + scrollViewHeight < contentHeight - 100;
        const hasEnoughContent = contentHeight > scrollViewHeight * 1.5;
        
        setShowScrollToBottom(isNotAtBottom && hasEnoughContent);
      }
    }
  );

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Send message function - implemented to fix the sendMessage reference error
  const sendMessage = (messageText?: string) => {
    // Use either the provided messageText or the current inputText
    const messageContent = messageText || inputText;
    
    if (!messageContent.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    };
    
    // Hide welcome screen and update messages
    setShowWelcome(false);
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input if we're using the input field text
    if (!messageText) {
      setInputText('');
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate AI response
      const responseText = getSimulatedResponse(messageContent, model);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseText,
        role: 'assistant',
        timestamp: new Date()
      };
      
      // Update messages with assistant response
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle suggestion clicks from welcome screen
  const handleSuggestion = (message: string) => {
    sendMessage(message);
  };

  // Simulate responses based on model choice
  const getSimulatedResponse = (userInput: string, modelType: ModelOption): string => {
    const userInputLower = userInput.toLowerCase();
    
    // Generate different responses based on model choice
    if (userInputLower.includes('gelatin') || userInputLower.includes('e471')) {
      if (modelType === 'concise') {
        return "Gelatin is typically haram unless from halal sources. Look for plant-based alternatives like agar-agar. E471 can be from plant or animal sources - check for halal certification.";
      } else if (modelType === 'detailed') {
        return "Gelatin is a protein derived from animal collagen, typically from pigs or cattle. In Islamic dietary law:\n\n- Gelatin from pork is always haram (forbidden)\n- Gelatin from cattle is only halal if the animal was slaughtered according to Islamic law\n- Many scholars consider all conventional gelatin to be haram due to uncertainty\n\nHalal alternatives include:\n- Agar-agar (seaweed extract)\n- Carrageenan (seaweed extract)\n- Pectin (fruit-based)\n- Fish gelatin (if from halal-slaughtered fish)\n- Certified halal bovine gelatin\n\nRegarding E471 (mono and diglycerides), it can be derived from either plant or animal sources. Only purchase products with E471 if they have reliable halal certification.";
      } else {
        return "Gelatin is typically derived from animal sources and is considered haram unless it comes from a halal source. Look for products that specifically mention 'halal gelatin' or 'plant-based gelatin alternatives' like agar-agar or carrageenan. E471 can be derived from both plant and animal sources, so check for halal certification to be sure.";
      }
    } else if (userInputLower.includes('scan') || userInputLower.includes('barcode')) {
      if (modelType === 'concise') {
        return "Tap the Camera icon at the bottom of your screen to scan product barcodes. We'll check if it's halal certified.";
      } else if (modelType === 'detailed') {
        return "Using the Halal Life Scanner:\n\n1. Tap the Camera icon in the center of the bottom navigation bar\n2. Allow camera permissions if prompted\n3. Position the product barcode within the scanning frame\n4. Hold the phone steady until the scan completes\n5. View the detailed halal status with ingredient analysis\n\nThe scanner checks against our database of:\n- Known halal certified products\n- Ingredient analysis for uncertified products\n- Community-reported information\n\nYou can also save scan results and report inaccuracies to help improve our database.";
      } else {
        return "You can use our built-in scanner feature to check if a product is halal. Simply tap the Camera icon in the bottom navigation bar and scan the product's barcode. We'll check our database for halal certification information and provide ingredient analysis.";
      }
    } else if (userInputLower.includes('restaurant') || userInputLower.includes('nearby')) {
      return "You can find halal restaurants nearby by using our Map feature. Tap the Map icon in the bottom navigation bar and enable location services. The map will show halal-certified restaurants in your area with ratings from other Halal Life users.";
    } else if (userInputLower.includes('certification') || userInputLower.includes('certified')) {
      return "Look for recognized halal certification symbols like HMC, IFANCA, JAKIM, or MUI. These certifications ensure that products meet Islamic dietary requirements. Our app can help you verify certifications when you scan products.";
    } else if (userInputLower.includes('halal') || userInputLower.includes('haram')) {
      return "I can help you determine if a product is halal or haram. You can ask me about specific ingredients or products, and I'll provide information based on Islamic dietary guidelines.";
    } else if (userInputLower.includes('hello') || userInputLower.includes('hi')) {
      return "Hello! I'm the Halal Life Assistant. How can I help you today?";
    } else if (userInputLower.includes('ingredient')) {
      return "If you want to know about specific ingredients, you can ask me directly or use our product scanner feature to check products while shopping.";
    } else {
      return "Thank you for your message. I'm here to help with questions about halal products, ingredients, and Islamic dietary guidelines. What specific information are you looking for?";
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  const handleInputSubmit = () => {
    if (inputText.trim()) {
      sendMessage();
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Render model option buttons
  const renderModelButtons = () => {
    const options: { label: string; value: ModelOption }[] = [
      { label: 'Standard', value: 'standard' },
      { label: 'Concise', value: 'concise' },
      { label: 'Detailed', value: 'detailed' },
    ];

    return (
      <View style={styles.modelOptionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[

              styles.modelOptionButton,
              model === option.value && styles.modelOptionButtonActive,
              { 
                borderColor: theme.colors.border,
                backgroundColor: model === option.value 
                  ? theme.colors.primary + '30'  // 30% opacity for better contrast
                  : 'transparent',
              }
            ]}
            onPress={() => {
              setModel(option.value);
            }}
          >
            <Text
              style={[
                styles.modelOptionText,
                { 
                  color: model === option.value 
                    ? themeName === 'dark' ? '#A5D6A7' : '#2E7D32' // Higher contrast colors
                    : themeName === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                  fontWeight: model === option.value ? '600' : 'normal',
                }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Settings modal content
  const renderSettingsModal = () => {
    if (!showSettings) return null;
    
    return (
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleSettings}
      >
        <View 
          style={[
            styles.settingsModalContainer,
            { backgroundColor: modalOverlayColor }
          ]}
        >
          <TouchableOpacity
            style={styles.settingsModalOverlay}
            activeOpacity={1}
            onPress={toggleSettings}
          />
          
          <Animated.View 
            style={[
              styles.settingsModalContent,
              { 
                backgroundColor: theme.colors.cardBackground || theme.colors.background,
                borderColor: theme.colors.border,
              }
            ]}
          >
            <View style={styles.settingsModalHeader}>
              <Text style={[styles.settingsModalTitle, { color: theme.colors.textPrimary }]}>
                Assistant Settings
              </Text>
              <TouchableOpacity onPress={toggleSettings}>
                <Ionicons name="close" size={24} color={headerIconColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.colors.textPrimary }]}>
                Response Style
              </Text>
              <Text style={[

                styles.settingsSectionDescription, 
                { color: themeName === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }
              ]}>
                Choose how detailed you want the assistant's responses to be
              </Text>
              {renderModelButtons()}
            </View>
            
            <View style={[styles.settingsDivider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.settingsSection}>
              <TouchableOpacity 
                style={styles.settingsClearButton} 
                onPress={() => {
                  clearChat();
                  toggleSettings();
                }}
              >
                <MaterialIcons name="delete-outline" size={20} color="#D32F2F" />
                <Text style={[styles.settingsClearButtonText, { color: "#D32F2F" }]}>
                  Clear conversation
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  // Define a new function to handle image picking and sending
  const handleImagePick = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!');
      return;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      
      // Create a new image message
      const userImageMessage: Message = {
        id: `user-${Date.now()}`,
        content: 'Image upload',  // Default text, user can edit before sending
        role: 'user',
        timestamp: new Date(),
        contentType: 'image',
        imageUri: selectedAsset.uri
      };
      
      // Update state with the message
      setShowWelcome(false);
      setMessages(prev => [...prev, userImageMessage]);
      
      // Simulate AI response to the image
      setIsLoading(true);
      setTimeout(() => {
        const responseText = "I've received your image. Is there anything specific about it you'd like me to help with?";
        
        // Create assistant message
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: responseText,
          role: 'assistant',
          timestamp: new Date()
        };
        
        // Update messages with assistant response
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        
        {/* Actions Bar */}
        <View style={[styles.actionsBar, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.actionButtons}>
            {messages.length > 0 && (
              <TouchableOpacity onPress={clearChat} style={styles.actionButton}>
                <Ionicons name="refresh" size={22} color={headerIconColor} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleSettings} style={styles.actionButton}>
              <Ionicons name="settings-outline" size={22} color={headerIconColor} />
            </TouchableOpacity>
          </View>
        </View>
        
        {showWelcome ? (
          <ModernWelcomeScreen onSuggestionPress={handleSuggestion} />
        ) : (
          <View style={styles.chatContainer}>
            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {messages.map((message, index) => (
                <ModernChatMessage 
                  key={message.id} 
                  message={message}
                  isLastAssistantMessage={
                    message.role === 'assistant' && 
                    index === messages.length - 1
                  }
                />
              ))}
              {isLoading && (
                <View style={styles.typingContainer}>
                  <View style={styles.avatarContainer}>
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: theme.colors.primary }
                      ]}>
                      <Ionicons name="chatbubble" size={18} color="#fff" />
                    </View>
                  </View>
                  <View 
                    style={[
                      styles.typingBubble,
                      { 
                        backgroundColor: themeName === 'dark' 
                          ? 'rgba(255, 255, 255, 0.12)' 
                          : 'rgba(0, 0, 0, 0.06)',
                      }
                    ]}
                  >
                    <View style={styles.typingAnimation}>
                      <View 
                        style={[
                          styles.typingDot, 
                          { 
                            backgroundColor: themeName === 'dark' 
                              ? 'rgba(255, 255, 255, 0.9)' 
                              : 'rgba(0, 0, 0, 0.7)' 
                          }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.typingDot, 
                          { 
                            backgroundColor: themeName === 'dark' 
                              ? 'rgba(255, 255, 255, 0.9)' 
                              : 'rgba(0, 0, 0, 0.7)' 
                          }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.typingDot, 
                          { 
                            backgroundColor: themeName === 'dark' 
                              ? 'rgba(255, 255, 255, 0.9)' 
                              : 'rgba(0, 0, 0, 0.7)' 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              )}
            </Animated.ScrollView>
            
            {showScrollToBottom && (
              <TouchableOpacity 
                style={[
                  styles.scrollToBottomButton,
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    borderWidth: 1, // Add border for better contrast
                  }
                ]}
                onPress={scrollToBottom}
              >
                <Ionicons 
                  name="chevron-down" 
                  size={22} 
                  color={themeName === 'dark' ? '#A5D6A7' : '#2E7D32'} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Input Area */}
        <View 
          style={[
            styles.inputContainer, 
            { 
              backgroundColor: themeName === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
              borderTopColor: theme.colors.border,
            }
          ]}
        >
          <View 
            style={[
              styles.inputWrapper,
              { 
                backgroundColor: theme.colors.cardBackground || theme.colors.background,
                borderColor: theme.colors.border,
              }
            ]}
          >
            {/* Camera/Image upload button */}
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.cameraButton}
            >
              <Ionicons 
                name="camera-outline" 
                size={22} 
                color={themeName === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'} 
              />
            </TouchableOpacity>
            
            <TextInput
              ref={inputRef}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message Halal Life Assistant..."
              placeholderTextColor={inputPlaceholderColor}
              style={[styles.input, { color: theme.colors.textPrimary }]}
              multiline
              maxLength={1000}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity
              onPress={handleInputSubmit}
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() 
                    ? theme.colors.primary 
                    : themeName === 'dark'
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(0, 0, 0, 0.15)',
                },
              ]}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Settings Modal */}
        {renderSettingsModal()}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 16,
  },
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
  },
  typingContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    marginRight: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  typingAnimation: {
    flexDirection: 'row',
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
    // Animation would go here with Animated API
  },
  scrollToBottomButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  settingsModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  settingsModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  settingsModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  settingsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingsSectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  modelOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modelOptionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modelOptionButtonActive: {
    borderWidth: 2,
  },
  modelOptionText: {
    fontSize: 14,
  },
  settingsDivider: {
    height: 1,
    marginVertical: 16,
  },
  settingsClearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsClearButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ModernChatView;