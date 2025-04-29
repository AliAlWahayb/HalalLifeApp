import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { Message } from './ChatAPI';

type ChatMessageProps = {
  message: Message;
  onSuggestionPress?: (suggestion: string) => void;
  suggestions?: string[];
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSuggestionPress,
  suggestions,
}) => {
  const { theme } = useTheme();
  const isUser = message.role === 'user';

  const formatTimestamp = (timestamp: Date) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Extract image data if present in the message
  const hasImage = message.image_data && message.image_data.startsWith('data:image');

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
      marginHorizontal: 12,
      maxWidth: '85%', // Appropriate width for messages
      alignSelf: isUser ? 'flex-end' : 'flex-start',
    },
    messageContainer: {
      borderRadius: 18,
      padding: 14,
      backgroundColor: isUser 
        ? '#4D80E8' // Brighter blue for user messages
        : '#262626', // Darker background for assistant messages
      borderWidth: 1,
      borderColor: isUser 
        ? 'rgba(77, 128, 232, 0.3)' 
        : 'rgba(255, 255, 255, 0.08)',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    messageText: {
      color: isUser ? '#FFFFFF' : '#FFFFFF',
      fontSize: 16,
      lineHeight: 23, // Increased for better readability
      fontWeight: '400',
      flexWrap: 'wrap', // Important for text wrapping
    },
    timestampText: {
      color: '#AAAAAA', // Lighter gray for better visibility
      fontSize: 12,
      marginTop: 4,
      marginHorizontal: 4,
      alignSelf: isUser ? 'flex-end' : 'flex-start',
    },
    suggestionsContainer: {
      marginTop: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignSelf: 'stretch',
    },
    suggestionButton: {
      backgroundColor: 'rgba(74, 86, 226, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(74, 86, 226, 0.5)',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    suggestionText: {
      color: '#6D78E6', // Brighter blue for better visibility
      fontSize: 14,
      fontWeight: '500',
    },
    avatarContainer: {
      width: 36, // Slightly larger
      height: 36, // Slightly larger
      borderRadius: 18,
      backgroundColor: isUser ? 'transparent' : '#4CAF50', // Green to match header
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%', // Ensure the row takes full width
    },
    contentContainer: {
      flex: 1, // Use flex to ensure proper sizing
      overflow: 'hidden', // Prevent content overflow
    },
    imageContainer: {
      marginBottom: 8,
      borderRadius: 12,
      overflow: 'hidden',
    },
    messageImage: {
      width: 200, // Adjusted size
      height: 150, // Adjusted size
      borderRadius: 12,
    },
    verdictText: {
      fontWeight: 'bold',
      color: message.content?.includes('VERDICT: HALAL') ? '#4CAF50' : 
             message.content?.includes('VERDICT: HARAM') ? '#FF5252' : '#FFA726',
    }
  });

  // Process verdict in message content
  const renderContent = () => {
    if (!message.content) return null;
    
    // Check if the message contains a verdict
    if (message.content.includes('VERDICT:')) {
      const parts = message.content.split(/VERDICT:\s*(HALAL|HARAM|UNKNOWN)/);
      if (parts.length >= 3) {
        return (
          <>
            <Text style={styles.verdictText}>VERDICT: {parts[1]}</Text>
            <Text style={styles.messageText}>{parts.slice(2).join('')}</Text>
          </>
        );
      }
    }
    
    // Regular message without verdict formatting
    return <Text style={styles.messageText}>{message.content}</Text>;
  };

  const renderSuggestions = () => {
    if (!suggestions || !onSuggestionPress) return null;

    return (
      <View style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => onSuggestionPress(suggestion)}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageRow}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>H</Text>
          </View>
        )}
        <View style={styles.contentContainer}>
          <View style={styles.messageContainer}>
            {/* Show the image if present */}
            {hasImage && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: message.image_data }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </View>
            )}
            
            {/* Show the text message */}
            {renderContent()}
          </View>
        </View>
      </View>
      <Text style={styles.timestampText}>{formatTimestamp(message.timestamp)}</Text>
      {renderSuggestions()}
    </View>
  );
};

export default ChatMessage;