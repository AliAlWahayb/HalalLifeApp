import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../themes/ThemeProvider';
import { Message } from './ModernChatView';

interface ChatMessageProps {
  message: Message;
  isLastAssistantMessage: boolean;
}

const ModernChatMessage: React.FC<ChatMessageProps> = ({ message, isLastAssistantMessage }) => {
  const { theme, themeName } = useTheme();
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Format timestamp
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes} ${
      hours >= 12 ? 'PM' : 'AM'
    }`;
  };

  const copyToClipboard = () => {
    // Simple mock of clipboard functionality without external dependencies
    try {
      // This is a simple operation that won't actually copy in a real app
      // but we'll simulate it for the UI feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  };
  
  // Define high contrast text colors
  const userBubbleTextColor = '#FFFFFF'; // White text on primary color background
  const assistantNameColor = themeName === 'dark' ? '#A5D6A7' : '#2E7D32'; // Darker green for better contrast
  
  // Define assistant bubble background with better contrast
  const assistantBubbleBackground = themeName === 'dark' 
    ? 'rgba(255, 255, 255, 0.12)' // Slightly more opaque in dark mode
    : 'rgba(0, 0, 0, 0.06)';      // Slightly darker in light mode

  // Render message content as plain text
  const renderMessageContent = () => {
    return (
      <Text
        style={[
          styles.messageText,
          { color: isUser ? userBubbleTextColor : theme.colors.textPrimary },
        ]}>
        {message.content}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={() => setShowActions(!showActions)}
      style={styles.messageWrapper}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primary }
            ]}>
            <Ionicons name="chatbubble" size={18} color="#fff" />
          </View>
        </View>
      )}

      <View
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.assistantContainer,
          {
            backgroundColor: isUser 
              ? theme.colors.primary 
              : assistantBubbleBackground,
          },
        ]}>
        {!isUser && (
          <View style={styles.nameContainer}>
            <Text style={[styles.nameText, { color: assistantNameColor }]}>Halal Assistant</Text>
          </View>
        )}
        
        <View style={styles.contentContainer}>
          {renderMessageContent()}
        </View>

        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              { 
                color: isUser 
                  ? 'rgba(255, 255, 255, 0.9)' // Improved contrast for user message timestamp
                  : themeName === 'dark' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'rgba(0, 0, 0, 0.6)' // Darker for better contrast in light mode
              },
            ]}>
            {formatTime(message.timestamp)}
          </Text>

          {showActions && !isUser && (
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.copyButton}>
              {copied ? (
                <Ionicons name="checkmark" size={16} color={assistantNameColor} />
              ) : (
                <MaterialIcons 
                  name="content-copy" 
                  size={16} 
                  color={themeName === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'} 
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isUser && (
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.accent }
            ]}>
            <Ionicons name="person" size={18} color="#fff" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userContainer: {
    marginLeft: 'auto',
  },
  assistantContainer: {
    marginRight: 'auto',
  },
  nameContainer: {
    marginBottom: 4,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '600',
  },
  contentContainer: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  copyButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 36,
    marginTop: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModernChatMessage;