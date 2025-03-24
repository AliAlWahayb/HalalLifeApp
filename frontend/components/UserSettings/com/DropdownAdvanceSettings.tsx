import React, { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'themes/ThemeProvider';

interface Item {
  label: string;
  value: string;
  danger?: boolean;
}

interface DropdownAdvanceSettingsProps {
  items: Item[];
  onSelect: (value: string) => void;
}

const DropdownAdvanceSettings = ({ items, onSelect }: DropdownAdvanceSettingsProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const { theme } = useTheme();

  
  const styledItems = items.map((item) => ({
    ...item,
    label: item.label,
    value: item.value,
    labelStyle: {
      color: item.danger ? 'red' : theme.colors.textPrimary,
      fontWeight: item.danger ? 'bold' : 'normal',
    },
  }));

  const handleChange = (val: string | null) => {
    setValue(val);
    if (val) onSelect(val);
  };

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={styledItems}
      setOpen={setOpen}
      setValue={handleChange}
      setItems={() => {}}
      placeholder="Advance User Settings"
      searchable={false}
      multiple={false}
      zIndex={1000}
      zIndexInverse={3000}
      style={{
        width: '90%',
        alignSelf: 'center',
        borderColor: open ? theme.colors.accent : theme.colors.textMuted,
        borderRadius: 12,
        borderWidth: 2,
      }}
      dropDownContainerStyle={{
        width: '90%',
        alignSelf: 'center',
        borderColor: theme.colors.textMuted,
        borderTopWidth: 0,
      }}
      placeholderStyle={{
        color: theme.colors.textMuted,
        fontWeight: 'bold',
      }}
      ArrowDownIconComponent={() => (
        <FontAwesome name="angle-down" size={22} color={theme.colors.textPrimary} />
      )}
      ArrowUpIconComponent={() => (
        <FontAwesome name="angle-up" size={22} color={theme.colors.textPrimary} />
      )}
      textStyle={{
        color: theme.colors.textPrimary,
        fontSize: 16,
      }}
    />
  );
};

export default DropdownAdvanceSettings;
