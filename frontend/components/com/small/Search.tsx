import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';

// Define types for search results
interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: number;
}

interface Post {
  id: string;
  text: string;
  image: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  time: string;
}

type SearchResult = {
  type: 'user' | 'post';
  item: User | Post;
};

// Sample data
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    handle: '@ahmedkhan',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    followers: 1205,
  },
  {
    id: '2',
    name: 'Jane Smith',
    handle: '@janesmith',
    avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    followers: 587,
  },
  {
    id: '3',
    name: 'John Doe',
    handle: '@johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    followers: 3240,
  },
];

const dummyPosts: Post[] = [
  {
    id: '1',
    text: 'Checking the new halal restaurant in LA. The food was amazing and the service was excellent!',
    image: 'https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    username: 'Ahmed Khan',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    likes: 110,
    comments: 32,
    time: '2h ago',
  },
  {
    id: '2',
    text: 'Loved the coffee at the new halal café in town! It\'s a great place to work and meet friends.',
    image: 'https://images.unsplash.com/photo-1529676468696-f3a47aba7d5d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    username: 'Jane Smith',
    userAvatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    likes: 56,
    comments: 12,
    time: '5h ago',
  },
];

// Recent search terms
const recentSearches = [
  'halal restaurant',
  'best coffee shops',
  'Muslim-friendly places',
  'halal certification',
];

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearchTerms, setRecentSearchTerms] = useState<string[]>(recentSearches);
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Search function
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simple search implementation
    const lowercaseQuery = query.toLowerCase();
    
    // Search users
    const userResults = dummyUsers
      .filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) || 
        user.handle.toLowerCase().includes(lowercaseQuery)
      )
      .map(user => ({ type: 'user' as const, item: user }));
    
    // Search posts
    const postResults = dummyPosts
      .filter(post => 
        post.text.toLowerCase().includes(lowercaseQuery) ||
        post.username.toLowerCase().includes(lowercaseQuery)
      )
      .map(post => ({ type: 'post' as const, item: post }));
    
    // Combine results
    setResults([...userResults, ...postResults]);
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    
    // Add to recent searches if it's not already there
    if (!recentSearchTerms.includes(searchTerm) && searchTerm.trim() !== '') {
      setRecentSearchTerms([searchTerm, ...recentSearchTerms.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    Keyboard.dismiss();
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'user') {
      const user = result.item as User;
      // @ts-ignore
      navigation.navigate('UserProfile', { userId: user.id });
    } else {
      const post = result.item as Post;
      // @ts-ignore
      navigation.navigate('PostDetail', { 
        post: {
          id: post.id,
          text: post.text,
          image: post.image,
          username: post.username,
          profileImage: post.userAvatar,
          address: 'Unknown location',
          likes: post.likes,
          comments: post.comments,
          time: post.time,
        } 
      });
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => {
    if (item.type === 'user') {
      const user = item.item as User;
      return (
        <TouchableOpacity 
          style={styles.resultItem}
          onPress={() => handleResultPress(item)}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userContent}>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user.name}
            </Text>
            <Text style={[styles.userHandle, { color: theme.colors.textMuted }]}>
              {user.handle} • {user.followers} followers
            </Text>
          </View>
          <Icon name="chevron-right" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      );
    } else {
      const post = item.item as Post;
      return (
        <TouchableOpacity 
          style={styles.resultItem}
          onPress={() => handleResultPress(item)}
        >
          <Image source={{ uri: post.image }} style={styles.postThumbnail} />
          <View style={styles.postContent}>
            <Text 
              style={[styles.postText, { color: theme.colors.textPrimary }]}
              numberOfLines={2}
            >
              {post.text}
            </Text>
            <View style={styles.postMeta}>
              <Text style={[styles.postMetaText, { color: theme.colors.textMuted }]}>
                {post.username} • {post.likes} likes • {post.time}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderRecentSearches = () => {
    return (
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={[styles.recentTitle, { color: theme.colors.textPrimary }]}>
            Recent Searches
          </Text>
          {recentSearchTerms.length > 0 && (
            <TouchableOpacity onPress={() => setRecentSearchTerms([])}>
              <Text style={{ color: theme.colors.primary }}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {recentSearchTerms.map((term, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.recentItem}
            onPress={() => handleSearch(term)}
          >
            <Icon name="history" size={16} color={theme.colors.textMuted} style={styles.recentIcon} />
            <Text style={[styles.recentText, { color: theme.colors.textPrimary }]}>
              {term}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        showBack={true}
        showSearch={false}
        showNotification={false}
      />
      
      {/* Search input */}
      <View style={styles.searchContainer}>
        <View 
          style={[
            styles.searchInputContainer, 
            { 
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderColor: isSearching ? theme.colors.primary : 'transparent' 
            }
          ]}
        >
          <Icon name="search" size={16} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder="Search posts, users, or keywords"
            placeholderTextColor={theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="times-circle" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${item.item.id}-${index}`}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        !isSearching && renderRecentSearches()
      )}
      
      {/* No results state */}
      {isSearching && results.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Icon 
            name="search" 
            size={48} 
            color={theme.colors.textMuted} 
            style={styles.noResultsIcon}
          />
          <Text style={[styles.noResultsText, { color: theme.colors.textMuted }]}>
            No results found
          </Text>
          <Text style={[styles.noResultsSubtext, { color: theme.colors.textMuted }]}>
            Try searching for different keywords or terms
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
  },
  postThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
    marginRight: 8,
  },
  postText: {
    fontSize: 15,
    marginBottom: 4,
    lineHeight: 20,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postMetaText: {
    fontSize: 13,
  },
  recentContainer: {
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  recentIcon: {
    marginRight: 12,
  },
  recentText: {
    fontSize: 15,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsIcon: {
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default Search; 