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
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'themes/ThemeProvider';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import Contributors from './Components/Contributors';
import Hero from './Components/Hero';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Notifications: undefined;
  Camera: undefined;
  Map: undefined;
  Search: undefined;
  Favorites: undefined;
};

type NavigationProp = BottomTabNavigationProp<RootStackParamList>;

// Demo data
const contributorsData = [
  {
    index: 1,
    name: 'John Doe',
    contributions: 100,
  },
  {
    index: 2,
    name: 'Doe John',
    contributions: 10,
  },
  {
    index: 3,
    name: 'Jane Smith',
    contributions: 1,
  },
  {
    index: 4,
    name: 'Alex Chen',
    contributions: 1,
  },
];

const featuredPlaces = [
  {
    id: '1',
    name: 'Halal Kitchen',
    rating: 4.8,
    type: 'Restaurant',
    distance: '1.2 km',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  },
  {
    id: '2',
    name: 'Green Café',
    rating: 4.5,
    type: 'Coffee Shop',
    distance: '0.8 km',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  },
  {
    id: '3',
    name: 'Authentic Grill',
    rating: 4.7,
    type: 'Grill House',
    distance: '2.4 km',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
  },
];

// Placeholder image blurhash
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const { width } = Dimensions.get('window');
const QUICK_ACTION_SIZE = (width - 56) / 2;

// Quick action buttons with icons and labels
const quickActions = [
  {
    id: 'scanner',
    name: 'Scanner',
    icon: 'barcode',
    iconType: 'MaterialCommunityIcons',
    screen: 'Camera',
  },
  { id: 'search', name: 'Search', icon: 'search', iconType: 'Ionicons', screen: 'Search' },
  {
    id: 'map',
    name: 'Map',
    icon: 'map-marker-outline',
    iconType: 'MaterialCommunityIcons',
    screen: 'Map',
  },
  { id: 'favorites', name: 'Favorites', icon: 'heart', iconType: 'Ionicons', screen: 'Favorites' },
];

const HomeView = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
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
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.name?.includes('Dark') ? 'light-content' : 'dark-content'} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Platform.OS === 'ios' ? 100 : 25,
          paddingBottom: Platform.OS === 'ios' ? 5 : 30,
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary, theme.colors.accent]}
          />
        }>
        {/* Hero Section with App Logo and Welcome Message */}
        <Hero />

        {/* Quick Actions Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between px-4">
            <Text
              className="text-xl font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}>
              Quick Actions
            </Text>
          </View>

          {/* Quick Action Buttons */}
          <View className="flex-row flex-wrap justify-between px-4">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => navigation.navigate(action.screen as keyof RootStackParamList)}
                className="mb-4 items-center justify-center rounded-2xl border border-gray-100 p-4"
                style={{
                  width: QUICK_ACTION_SIZE,
                  height: QUICK_ACTION_SIZE - 30,
                  backgroundColor: theme.colors.background,
                  shadowColor: theme.colors.textPrimary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                <View
                  className="mb-3 h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${theme.colors.primary}15`,
                  }}>
                  {action.iconType === 'Ionicons' && (
                    <Ionicons name={action.icon as any} size={24} color={theme.colors.primary} />
                  )}
                  {action.iconType === 'MaterialCommunityIcons' && (
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
                <Text className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                  {action.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Places Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between px-4">
            <Text
              className="text-xl font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}>
              Featured Places
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Map' as keyof RootStackParamList)}>
              <Text className="text-sm" style={{ color: theme.colors.primary }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Scroll for Featured Places */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 5 }}>
            {featuredPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                className="mx-1 w-[270px] overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: theme.colors.background,
                  shadowColor: theme.colors.textPrimary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                onPress={() => navigation.navigate('Map' as keyof RootStackParamList)}>
                <ImageBackground
                  source={{ uri: place.image }}
                  className="h-[140px] w-full"
                  resizeMode="cover">
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    className="absolute bottom-0 left-0 right-0 h-[70px]"
                  />
                  <View
                    className="absolute right-3 top-3 flex-row items-center rounded-xl px-2 py-1"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    }}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text className="ml-1 text-xs font-semibold text-white">{place.rating}</Text>
                  </View>
                </ImageBackground>

                <View className="p-3">
                  <Text className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                    {place.name}
                  </Text>

                  <View className="mt-1.5 flex-row items-center">
                    <Text className="mr-3 text-xs" style={{ color: theme.colors.textMuted }}>
                      {place.type}
                    </Text>

                    <View className="flex-row items-center">
                      <Ionicons name="location" size={12} color={theme.colors.accent} />
                      <Text className="ml-0.5 text-xs" style={{ color: theme.colors.textMuted }}>
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
        {/* <View className="mb-5">
          <View className="mb-4 flex-row items-center justify-between px-4">
            <Text
              className="text-xl font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}>
              Top Contributors
            </Text>
          </View>

          <View
            className="mx-4 rounded-2xl px-4 py-4"
            style={{
              backgroundColor: `${theme.colors.primary}08`,
            }}>
            {contributorsData.map((contributor, index) => (
              <Contributors
                key={contributor.index}
                index={contributor.index}
                name={contributor.name}
                contributions={contributor.contributions}
                onPress={() => {}}
                isLast={index === contributorsData.length - 1}
              />
            ))}
          </View>
        </View> */}
      </Animated.ScrollView>
    </View>
  );
};

export default HomeView;
