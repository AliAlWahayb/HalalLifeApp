import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';

type Message = {
  id: string;
  text?: string;
  image?: string;
  sender: 'user' | 'bot';
};

const ChatView = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I assist you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: inputText, sender: 'user' },
      ]);
      setInputText('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), image: result.assets[0].uri, sender: 'user' },
      ]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), image: result.assets[0].uri, sender: 'user' },
      ]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={{
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? theme.colors.accent : '#778899',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
        maxWidth: '70%',
      }}>
      {item.text && <Text style={{ color: theme.colors.textSecondary }}>{item.text}</Text>}
      {item.image && (
        <Image source={{ uri: item.image }} style={{ width: 150, height: 150, borderRadius: 10 }} />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          backgroundColor: theme.colors.textSecondary,
          borderRadius: 25,
          paddingHorizontal: 10,
          paddingVertical: 5,
          elevation: 5,
        }}>
        <TouchableOpacity onPress={pickImage} style={{ marginRight: 10 }}>
          <Ionicons name="image" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} style={{ marginRight: 10 }}>
          <Ionicons name="camera" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TextInput
          style={{ flex: 1, color: theme.colors.textPrimary }}
          placeholder="Type a message"
          placeholderTextColor={theme.colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
          <Ionicons name="send" size={24} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatView;
