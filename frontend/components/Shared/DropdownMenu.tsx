import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from 'themes/ThemeProvider';

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

  const { theme } = useTheme();

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
      style={{
        width: '90%',
        alignSelf: 'center',
        borderColor: theme.colors.textMuted,
        borderRadius: 12,
        borderWidth: 2,
      }}
      dropDownContainerStyle={{
        width: '90%',
        alignSelf: 'center',
        borderColor: theme.colors.textMuted,
        borderTopWidth: 0,
      }}
      placeholder={placeholder}
      placeholderStyle={{
        color: theme.colors.textMuted,
        fontWeight: 'bold',
      }}
      TickIconComponent={() => (
        <View className="bg-accent rounded-full p-1">
          <FontAwesome name="check" size={16} color={theme.colors.textSecondary} />
        </View>
      )}
      mode="BADGE"
      showBadgeDot={false}
      badgeColors={theme.colors.accent}
      badgeTextStyle={{
        color: theme.colors.textSecondary,
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
        color: theme.colors.textPrimary,
        fontSize: 16,
      }}
    />
  );
};

export default DropdownMenu;
