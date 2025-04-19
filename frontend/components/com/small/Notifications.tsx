import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';

// Notification types
type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  time: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content?: string;
  postId?: string;
  commentId?: string;
}

// Sample notification data
const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    read: false,
    time: '5m ago',
    user: {
      id: '101',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    },
    postId: '1',
  },
  {
    id: '2',
    type: 'comment',
    read: false,
    time: '15m ago',
    user: {
      id: '102',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    content: 'Great post! I really enjoyed reading this.',
    postId: '2',
    commentId: '123',
  },
  {
    id: '3',
    type: 'follow',
    read: true,
    time: '2h ago',
    user: {
      id: '103',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: '4',
    type: 'mention',
    read: true,
    time: '1d ago',
    user: {
      id: '104',
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    },
    content: 'Hey @user, check out this great halal restaurant!',
    postId: '3',
  },
  {
    id: '5',
    type: 'like',
    read: true,
    time: '2d ago',
    user: {
      id: '105',
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    postId: '4',
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return { name: 'heart', color: theme.colors.primary };
      case 'comment':
        return { name: 'comment', color: theme.colors.accent };
      case 'follow':
        return { name: 'user-plus', color: '#4CAF50' };
      case 'mention':
        return { name: 'at', color: '#2196F3' };
      default:
        return { name: 'bell', color: theme.colors.textMuted };
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a post';
      default:
        return 'interacted with your content';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(
      notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate based on notification type
    if (notification.type === 'follow') {
      // @ts-ignore
      navigation.navigate('UserProfile', { userId: notification.user.id });
    } else if (notification.postId) {
      // @ts-ignore
      navigation.navigate('PostDetail', { 
        post: { id: notification.postId },
        commentId: notification.commentId
      });
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          item.read ? {} : { backgroundColor: 'rgba(0, 0, 0, 0.03)' }
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${icon.color}20` }]}>
            <Icon name={icon.name} size={16} color={icon.color} solid />
          </View>
        </View>
        
        <Image 
          source={{ uri: item.user.avatar }} 
          style={styles.avatar} 
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.username, { color: theme.colors.textPrimary }]}>
              {item.user.name}
            </Text>
            <Text style={[styles.timeText, { color: theme.colors.textMuted }]}>
              {item.time}
            </Text>
          </View>
          
          <Text style={[styles.notificationText, { color: theme.colors.textPrimary }]}>
            {getNotificationText(item)}
          </Text>
          
          {item.content && (
            <Text 
              style={[styles.contentText, { color: theme.colors.textMuted }]}
              numberOfLines={2}
            >
              {item.content}
            </Text>
          )}
        </View>
        
        {!item.read && (
          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Notifications" 
        showBack={true}
        showSearch={false}
        showNotification={false}
      />
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {notifications.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon 
            name="bell-slash" 
            size={48} 
            color={theme.colors.textMuted} 
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            No notifications yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>
            When you receive notifications, they'll appear here
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
  },
  timeText: {
    fontSize: 12,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default Notifications; 