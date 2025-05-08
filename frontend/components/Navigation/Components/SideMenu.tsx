import { FontAwesome5, Fontisto, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import profile from 'components/Profile/Profile';
import React, { useState, useEffect, useCallback, memo } from 'react';
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

interface SideMenuItem {
  id: string;
  icon: (isActive: boolean) => React.ReactNode;
  label: string;
}

interface SideMenuProps {
  /** Whether the side menu modal is visible */
  modalVisible: boolean;
  /** Function to toggle the visibility of the side menu */
  setModalVisible: (visible: boolean) => void;
}

/**
 * SideMenu component for application navigation
 */
const SideMenu: React.FC<SideMenuProps> = ({ modalVisible, setModalVisible }) => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const navigation = useNavigation();
  const state = navigation.getState();
  const { theme } = useTheme();
  const slideAnim = useState(new Animated.Value(-300))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const IconSize = 24;
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.textSecondary;

  // Animate menu when visibility changes
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
  }, [modalVisible, slideAnim, fadeAnim]);

  // Set initial selection based on current route
  useEffect(() => {
    if (state?.routes && state.index >= 0) {
      setSelectedItem(state.routes[state.index].name);
    }
  }, [state]);

  const items: SideMenuItem[] = [
    {
      id: 'History',
      icon: (isActive) => (
        <Octicons name="history" size={IconSize} color={isActive ? activeColor : inactiveColor} />
      ),
      label: 'History',
    },
    {
      id: 'Preferences',
      icon: (isActive) => (
        <FontAwesome5
          name="allergies"
          size={IconSize}
          color={isActive ? activeColor : inactiveColor}
        />
      ),
      label: 'Preferences',
    },
    {
      id: 'Account Settings',
      icon: (isActive) => (
        <FontAwesome5 name="cog" size={IconSize} color={isActive ? activeColor : inactiveColor} />
      ),
      label: 'Account Settings',
    },
    {
      id: 'UserSettings',
      icon: (isActive) => (
        <FontAwesome5
          name="user-alt"
          size={IconSize}
          color={isActive ? activeColor : inactiveColor}
        />
      ),
      label: 'UserSettings',
    },
    {
      id: 'Theme',
      icon: (isActive) => (
        <MaterialIcons
          name="color-lens"
          size={IconSize}
          color={isActive ? activeColor : inactiveColor}
        />
      ),
      label: 'Theme',
    },
  ];

  const isItemActive = useCallback(
    (itemId: string) => selectedItem === itemId && state?.routes[state.index].name === itemId,
    [selectedItem, state]
  );

  const handleItemPress = useCallback(
    (itemId: string) => {
      setSelectedItem(itemId);
      // @ts-ignore
      navigation.navigate('Navigation', { screen: itemId });
      setModalVisible(false);
    },
    [navigation, setModalVisible]
  );

  const handleCloseMenu = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  return (
    <Modal animationType="none" transparent visible={modalVisible} onRequestClose={handleCloseMenu}>
      <SafeAreaView className="flex-1">
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <Animated.View className="flex-1 bg-black/50" style={{ opacity: fadeAnim }}>
            <Animated.View
              className="h-full w-[70%] flex-col justify-start rounded-br-3xl rounded-tr-3xl bg-accent shadow-xl"
              style={{
                transform: [{ translateX: slideAnim }],
              }}>
              <View className="border-b border-gray-200/20 px-5 py-8">
                <Text className="text-2xl font-bold color-slate-200">HalalLife</Text>
              </View>

              <View className="flex-1 py-6">
                {items.map((item) => {
                  const active = isItemActive(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      className={`mx-3 mb-2 flex flex-row items-center rounded-xl px-4 py-3 ${active ? 'bg-primary/10' : ''}`}
                      onPress={() => handleItemPress(item.id)}
                      activeOpacity={0.7}>
                      {item.icon(active)}
                      <Text
                        className={`ml-4 text-base font-medium ${active ? 'font-bold text-primary' : 'text-textSecondary'}`}>
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

              <View className="border-t border-gray-200/20 px-5 pb-8 pt-4">
                <TouchableOpacity
                  className="flex flex-row items-center rounded-xl px-4 py-3"
                  onPress={handleCloseMenu}>
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

export default memo(SideMenu);
