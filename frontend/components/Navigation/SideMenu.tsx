import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5, Fontisto, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const IconSize = 32;
const color = 'white';

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
    id: 'User settings',
    icon: <FontAwesome5 name="user-alt" size={IconSize} color={color} />,
  },
  {
    id: 'Theme',
    icon: <MaterialIcons name="color-lens" size={IconSize} color={color} />,
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
  const state = navigation.getState();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View className="flex-1 items-end bg-black/50">
          <View className="flex h-1/3 w-3/5 flex-col items-start justify-evenly  rounded-bl-3xl rounded-tl-3xl bg-[#77C273] px-5 py-2 ">
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                className={`flex w-full flex-row gap-3 rounded-full px-3 py-2 ${selectedItem === item.id && state?.routes[state.index].name === item.id ? 'bg-[#61A55D]' : 'bg-[#77C273]'}`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  setSelectedItem(item.id);
                  // @ts-ignore
                  navigation.navigate(item.id);
                }}
                activeOpacity={1}>
                {item.icon}
                <Text className="align-middle font-bold text-white">{item.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SideMenu;
