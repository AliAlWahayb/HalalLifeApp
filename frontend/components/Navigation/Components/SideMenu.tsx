import { FontAwesome5, Fontisto, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

const SideMenu = ({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) => {
  const [selectedItem, setSelectedItem] = useState('');
  const navigation = useNavigation();
  const state = navigation.getState();
  const { theme } = useTheme();
  const slideAnim = useState(new Animated.Value(-300))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const IconSize = 24;
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.textSecondary;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  useEffect(() => {
    // Set initial selection based on current route
    if (state?.routes && state.index >= 0) {
      setSelectedItem(state.routes[state.index].name);
    }
  }, [state]);

  const items = [
    {
      id: 'History',
      icon: (isActive) => <Octicons name="history" size={IconSize} color={isActive ? activeColor : inactiveColor} />,
      label: 'History',
    },
    {
      id: 'Preferences',
      icon: (isActive) => <FontAwesome5 name="allergies" size={IconSize} color={isActive ? activeColor : inactiveColor} />,
      label: 'Preferences',
    },
    {
      id: 'Favorites',
      icon: (isActive) => <Fontisto name="favorite" size={IconSize} color={isActive ? activeColor : inactiveColor} />,
      label: 'Favorites',
    },
    {
      id: 'Profile',
      icon: (isActive) => <FontAwesome5 name="user-alt" size={IconSize} color={isActive ? activeColor : inactiveColor} />,
      label: 'Profile',
    },
    {
      id: 'Theme',
      icon: (isActive) => <MaterialIcons name="color-lens" size={IconSize} color={isActive ? activeColor : inactiveColor} />,
      label: 'Theme',
    },
  ];

  const isItemActive = (itemId) => selectedItem === itemId && state?.routes[state.index].name === itemId;

  return (
    <Modal
      animationType="none"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <SafeAreaView className="flex-1">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <Animated.View 
            className="flex-1 bg-black/50"
            style={{ opacity: fadeAnim }}>
            <Animated.View 
              className="flex h-full w-[70%] flex-col justify-start rounded-tr-3xl rounded-br-3xl bg-accent shadow-xl"
              style={{ 
                transform: [{ translateX: slideAnim }],
              }}>
              <View className="px-5 py-8 border-b border-gray-200/20">
                <Text className="text-2xl font-bold color-slate-200">HalalLife</Text>
              </View>
              
              <View className="flex-1 py-6">
                {items.map((item) => {
                  const active = isItemActive(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      className={`flex flex-row items-center mb-2 mx-3 px-4 py-3 rounded-xl ${active ? 'bg-primary/10' : ''}`}
                      onPress={() => {
                        setSelectedItem(item.id);
                        // @ts-ignore
                        navigation.navigate('Navigation', { screen: item.id });
                        setModalVisible(false);
                      }}
                      activeOpacity={0.7}>
                      {item.icon(active)}
                      <Text className={`ml-4 text-base font-medium ${active ? 'text-primary font-bold' : 'text-textSecondary'}`}>
                        {item.label}
                      </Text>
                      {active && (
                        <View className="ml-auto">
                          <View className="h-2 w-2 rounded-full bg-primary" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <View className="pb-8 px-5 border-t border-gray-200/20 pt-4">
                <TouchableOpacity 
                  className="flex flex-row items-center px-4 py-3 rounded-xl" 
                  onPress={() => setModalVisible(false)}>
                  <Octicons name="sign-out" size={IconSize} color={inactiveColor} />
                  <Text className="ml-4 text-base font-medium text-textSecondary">Close Menu</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

export default SideMenu;
