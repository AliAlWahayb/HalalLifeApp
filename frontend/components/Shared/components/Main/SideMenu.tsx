import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Fontisto, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const IconSize = 28;
const color = 'white';

const items = [
  {
    id: 'history',
    icon: <Octicons name="history" size={IconSize} color={color} />,
    label: 'History',
  },
  {
    id: 'preferences',
    icon: <FontAwesome5 name="allergies" size={IconSize} color={color} />,
    label: 'Preferences',
  },
  {
    id: 'favorites',
    icon: <Fontisto name="favorite" size={IconSize} color={color} className="ms-2" />,
    label: 'Favorites',
  },
  {
    id: 'user-settings',
    icon: <FontAwesome5 name="user-alt" size={IconSize} color={color} />,
    label: 'User Settings',
  },
  {
    id: 'theme',
    icon: <MaterialIcons name="color-lens" size={IconSize} color={color} />,
    label: 'Theme',
  },
];

const SideMenu = ({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) => {
  const [selectedItem, setSelectedItem] = useState('');
  const navigation = useNavigation();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View className="flex-1 items-end bg-black/50">
        <View className="flex h-1/3 w-3/5 flex-col items-start justify-evenly  rounded-bl-3xl rounded-tl-3xl bg-[#77C273] px-5 py-2 ">
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`flex w-full flex-row gap-3 rounded-full px-3 py-2 ${selectedItem === item.id ? 'bg-[#61A55D]' : 'bg-[#77C273]'}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.5}
              onPress={() => {
                setSelectedItem(item.id);
                navigation.navigate('Map');
              }}>
              {item.icon}
              <Text className="align-middle font-bold text-white">{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'red' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SideMenu;
