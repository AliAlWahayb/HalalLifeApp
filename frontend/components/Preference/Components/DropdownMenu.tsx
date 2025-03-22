import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface DropdownMenuProps {
  placeholder: string;
  items: Item[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  zIndex: number;
  zIndexInverse: number;
}

interface Item {
  label: string;
  value: string;
}

const DropdownMenu = ({
  placeholder,
  items,
  setValue,
  zIndex,
  zIndexInverse,
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [value, setLocalValue] = useState<string[]>([]);

  const handleChange = (newValue: string[]) => {
    setLocalValue(newValue);
    setValue(newValue);
  };

  return (
    <DropDownPicker
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      open={open}
      value={value}
      items={items}
      multiple
      setOpen={setOpen}
      setValue={handleChange as React.Dispatch<React.SetStateAction<string[]>>}
      setItems={() => {}}
      style={{ width: '90%', alignSelf: 'center', borderColor: 'grey', borderRadius: 12 }}
      dropDownContainerStyle={{
        width: '90%',
        alignSelf: 'center',
        borderColor: 'gray',
        borderTopWidth: 0,
      }}
      placeholder={placeholder}
      placeholderStyle={{
        color: 'grey',
        fontWeight: 'bold',
      }}
      TickIconComponent={() => (
        <View className="rounded-full bg-[#77C273] p-1">
          <FontAwesome name="check" size={16} color="white" />
        </View>
      )}
      mode="BADGE"
      showBadgeDot={false}
      badgeColors="#77C273"
      badgeTextStyle={{
        color: 'white',
      }}
      searchable
      searchTextInputProps={{
        maxLength: 25,
      }}
      searchContainerStyle={{
        borderBottomWidth: 0,
      }}
      searchPlaceholder="Search..."
      textStyle={{
        color: 'black',
        fontSize: 16,
      }}
    />
  );
};

export default DropdownMenu;
