import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  StatusBar, 
  Platform, 
  ImageBackground,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import Contributors from './Components/Contributors';

// Demo data
const contributorsData = [
  { index: 1, name: 'John Doe', contributions: 100, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { index: 2, name: 'Doe John', contributions: 10, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { index: 3, name: 'Jane Smith', contributions: 1, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { index: 4, name: 'Alex Chen', contributions: 1, avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

const featuredPlaces = [
  { 
    id: '1', 
    name: 'Halal Kitchen', 
    rating: 4.8, 
    type: 'Restaurant', 
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
  },
  { 
    id: '2', 
    name: 'Green Café', 
    rating: 4.5, 
    type: 'Coffee Shop', 
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
  },
  { 
    id: '3', 
    name: 'Authentic Grill', 
    rating: 4.7, 
    type: 'Grill House', 
    distance: '2.4 km',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80'
  },
];

// Placeholder image blurhash
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const { width } = Dimensions.get('window');
const QUICK_ACTION_SIZE = (width - 56) / 2;

// Quick action buttons with icons and labels
const quickActions = [
  { id: 'scanner', name: 'Scanner', icon: 'barcode-scan', screen: 'Camera' },
  { id: 'search', name: 'Search', icon: 'search', screen: 'Search' },
  { id: 'map', name: 'Map', icon: 'map-marker', screen: 'Map' },
  { id: 'favorites', name: 'Favorites', icon: 'heart', screen: 'Favorites' },
];

const HomeView = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Animation values for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [Platform.OS === 'ios' ? 100 : 80, Platform.OS === 'ios' ? 60 : 50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.3, 1],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -5],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.name.includes('Dark') ? "light-content" : "dark-content"} />
      
      {/* Animated Header */}
      <Animated.View 
        style={{ 
          position: 'absolute',
          top: 8,
          left: 0,
          right: 0,
          height: headerHeight,
          backgroundColor: theme.colors.background,
          zIndex: 10,
          opacity: headerOpacity,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
          paddingHorizontal: 16,
          justifyContent: 'center',
          
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 3 }}>
          <Animated.Text 
            style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.colors.primary,
              transform: [{ scale: titleScale }, { translateY: titleTranslateY }]
            }}
          >
            Halal<Text style={{ color: theme.colors.textPrimary }}>Life</Text>
          </Animated.Text>
          
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: theme.colors.background,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={theme.colors.textPrimary} />
              <View 
                style={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  width: 8, 
                  height: 8, 
                  borderRadius: 4, 
                  backgroundColor: theme.colors.accent 
                }} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: theme.colors.background, 
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}
              onPress={() => navigation.navigate('Profile')}
            >
              <FontAwesome5 name="user" size={18} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: Platform.OS === 'ios' ? 100 : 80,
          paddingBottom: 30,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary, theme.colors.accent]}
          />
        }
      >
        {/* Hero Section with App Logo and Welcome Message */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 16, 
          }}>
            <View>
              <Text style={{ 
                fontSize: 28, 
                fontWeight: 'bold', 
                color: theme.colors.textPrimary, 
                lineHeight: 34,
                marginBottom: 6,
              }}>
                Welcome to 
              </Text>
              <Text style={{ 
                fontSize: 32, 
                fontWeight: 'bold', 
                color: theme.colors.primary, 
                lineHeight: 38,
              }}>
                HalalLife
              </Text>
              <Text style={{ 
                fontSize: 16, 
                color: theme.colors.textMuted, 
                marginTop: 8,
              }}>
                Explore halal options around you
              </Text>
            </View>
            
            <Image
              source={require('../../assets/Home/Home.png')}
              style={{ width: 120, height: 120 }}
              placeholder={{ blurhash }}
              contentFit="contain"
            />
          </View>
        </View>
        
        {/* Quick Actions Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ 
            paddingHorizontal: 16, 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.colors.textPrimary 
            }}>
              Quick Actions
            </Text>
            
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary, fontSize: 14 }}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Quick Action Buttons */}
          <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                onPress={() => navigation.navigate(action.screen)}
                style={{ 
                  width: QUICK_ACTION_SIZE, 
                  height: QUICK_ACTION_SIZE - 30,
                  backgroundColor: theme.colors.background,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: theme.colors.textPrimary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                }}
              >
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: `${theme.colors.primary}15`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Ionicons name={action.icon} size={24} color={theme.colors.primary} />
                </View>
                <Text style={{ fontSize: 14, color: theme.colors.textPrimary, fontWeight: '500' }}>
                  {action.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Featured Places Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ 
            paddingHorizontal: 16, 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.colors.textPrimary 
            }}>
              Featured Places
            </Text>
            
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={{ color: theme.colors.primary, fontSize: 14 }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Horizontal Scroll for Featured Places */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            {featuredPlaces.map((place) => (
              <TouchableOpacity 
                key={place.id}
                style={{ 
                  width: 270, 
                  marginHorizontal: 4,
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: theme.colors.background,
                  shadowColor: theme.colors.textPrimary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                onPress={() => navigation.navigate('Map')}
              >
                <ImageBackground
                  source={{ uri: place.image }}
                  style={{ width: '100%', height: 140 }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 70,
                    }}
                  />
                  <View style={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={{ color: '#fff', marginLeft: 4, fontSize: 12, fontWeight: '600' }}>
                      {place.rating}
                    </Text>
                  </View>
                </ImageBackground>
                
                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                    {place.name}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ fontSize: 13, color: theme.colors.textMuted, marginRight: 12 }}>
                      {place.type}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="location" size={12} color={theme.colors.accent} />
                      <Text style={{ fontSize: 13, color: theme.colors.textMuted, marginLeft: 2 }}>
                        {place.distance}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Contributors Section */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ 
            paddingHorizontal: 16, 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.colors.textPrimary 
            }}>
              Top Contributors
            </Text>
          </View>
          
          <View style={{ 
            backgroundColor: `${theme.colors.primary}08`, 
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 16,
            marginHorizontal: 16,
          }}>
            {contributorsData.map((contributor, index) => (
              <View 
                key={contributor.index}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: index < contributorsData.length - 1 ? 1 : 0,
                  borderBottomColor: `${theme.colors.textMuted}20`,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 18, 
                    backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : theme.colors.textMuted,
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ 
                      color: index < 3 ? '#fff' : theme.colors.textSecondary, 
                      fontWeight: 'bold' 
                    }}>
                      {contributor.index}
                    </Text>
                  </View>
                  
                  <Image
                    source={{ uri: contributor.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                  />
                  
                  <View>
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '600',
                      color: theme.colors.textPrimary,
                    }}>
                      {contributor.name}
                    </Text>
                    <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
                      {contributor.contributions} contributions
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 16,
                  }}
                >
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                    Follow
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default HomeView;
