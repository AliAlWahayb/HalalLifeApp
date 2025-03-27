import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5, Fontisto, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

  const IconSize = 32;
  const color = theme.colors.textSecondary;

  const items = [
    {
      id: 'History',
      icon: <Octicons name="history" size={IconSize} color={color} />,
    },
    {
      id: 'Preferences',
      icon: <FontAwesome5 name="allergies" size={IconSize} color={color} />,
    },
    {
      id: 'Favorites',
      icon: <Fontisto name="favorite" size={IconSize} color={color} className="ms-2" />,
    },
    {
      id: 'Profile',
      icon: <FontAwesome5 name="user-alt" size={IconSize} color={color} />,
    },
    {
      id: 'Theme',
      icon: <MaterialIcons name="color-lens" size={IconSize} color={color} />,
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View className="flex-1 items-end bg-black/50">
          <View className="flex h-1/3 w-3/5 flex-col items-start justify-evenly  rounded-bl-3xl rounded-tl-3xl bg-accent px-5 py-2 ">
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                className={`flex w-full flex-row gap-3 rounded-full px-3 py-2 ${selectedItem === item.id && state?.routes[state.index].name === item.id ? 'bg-secondary' : 'bg-accent'}`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  setSelectedItem(item.id);
                  // @ts-ignore
                  navigation.navigate('Navigation', { screen: item.id });
                  setModalVisible(false);
                }}
                activeOpacity={1}>
                {item.icon}
                <Text className="align-middle font-bold text-textSecondary">{item.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SideMenu;
