import CustomAlert from 'components/Shared/CustomAlert';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

interface Preference {
  id: string;
  label: string;
  selected: boolean;
}

interface PreferenceGroup {
  id: string;
  title: string;
  preferences: Preference[];
}

interface SavedPreferencesPayload {
  preferences: {
    [groupId: string]: string[];
  };
}

const createPreferenceGroups = (): PreferenceGroup[] => {
  const dietaryItems = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten_free' },
    { label: 'Keto', value: 'keto' },
  ];

  const foodPreferenceItems = [
    { label: 'Organic', value: 'organic' },
    { label: 'Non-GMO', value: 'non_gmo' },
    { label: 'Low Sugar', value: 'low_sugar' },
    { label: 'High Protein', value: 'high_protein' },
  ];

  const caloriePreferenceItems = [
    { label: 'Low Calorie', value: 'low_calorie' },
    { label: 'Moderate Calorie', value: 'moderate_calorie' },
    { label: 'High Calorie', value: 'high_calorie' },
  ];

  const allergyItems = [
    { label: 'Peanuts', value: 'peanuts' },
    { label: 'Tree Nuts', value: 'tree_nuts' },
    { label: 'Dairy', value: 'dairy' },
    { label: 'Soy', value: 'soy' },
    { label: 'Eggs', value: 'eggs' },
    { label: 'Shellfish', value: 'shellfish' },
    { label: 'Wheat', value: 'wheat' },
    { label: 'Sesame', value: 'sesame' },
  ];

  const mapToPreferences = (items: { label: string; value: string }[]): Preference[] => {
    return items.map((item) => ({
      id: item.value,
      label: item.label,
      selected: false,
    }));
  };

  return [
    {
      id: 'dietary',
      title: 'Dietary Preference',
      preferences: mapToPreferences(dietaryItems),
    },
    {
      id: 'food',
      title: 'Food Preference',
      preferences: mapToPreferences(foodPreferenceItems),
    },
    {
      id: 'calorie',
      title: 'Calorie Preferences',
      preferences: mapToPreferences(caloriePreferenceItems),
    },
    {
      id: 'allergies',
      title: 'Allergies',
      preferences: mapToPreferences(allergyItems),
    },
  ];
};

const Preferences = () => {
  const { theme } = useTheme();
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);

  const [isResetAlertVisible, setResetAlertVisible] = useState(false);
  const [resetGroupId, setResetGroupId] = useState<string | null>(null);

  const handleCloseSuccessAlert = () => {
    setSuccessAlertVisible(false);
  };

  const handleCloseResetAlert = () => {
    setResetAlertVisible(false);
    setResetGroupId(null);
  };

  const handleConfirmReset = () => {
    if (resetGroupId) {
      setPreferenceGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === resetGroupId) {
            return {
              ...group,
              preferences: group.preferences.map((pref) => {
                return { ...pref, selected: false };
              }),
            };
          }
          return group;
        })
      );
    }
    setResetAlertVisible(false);
    setResetGroupId(null);
  };

  const [preferenceGroups, setPreferenceGroups] =
    useState<PreferenceGroup[]>(createPreferenceGroups());

  const togglePreference = (groupId: string, preferenceId: string) => {
    setPreferenceGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            preferences: group.preferences.map((pref) => {
              if (pref.id === preferenceId) {
                return { ...pref, selected: !pref.selected };
              }
              return pref;
            }),
          };
        }
        return group;
      })
    );
  };

  const resetGroup = (groupId: string) => {
    setResetGroupId(groupId);
    setResetAlertVisible(true);
  };

  const handleSave = () => {
    const selectedChipPreferences: { [groupId: string]: string[] } = {};

    preferenceGroups.forEach((group) => {
      selectedChipPreferences[group.id] = group.preferences
        .filter((pref) => pref.selected)
        .map((pref) => pref.id);
    });

    const preferencesToSave: SavedPreferencesPayload = {
      preferences: selectedChipPreferences,
    };

    setSuccessAlertVisible(true);
  };

  const renderPreferenceChip = ({ item, groupId }: { item: Preference; groupId: string }) => (
    <TouchableOpacity
      key={item.id}
      className={`mb-2 mr-2 rounded-full border px-3.5 py-2
             ${item.selected ? `border-primary bg-accent` : `border-textPrimary bg-background`}`}
      onPress={() => togglePreference(groupId, item.id)}>
      <Text
        className={`text-sm font-medium
                 ${item.selected ? 'text-white' : `text-textPrimary`}`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <View className="p-5 pb-0">
        <Text className="mb-1 text-xl font-bold text-textPrimary">User Preferences</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {preferenceGroups.map((group) => (
          <View key={group.id} className="mb-7">
            <View className="mb-3 flex-row items-center justify-between pe-2">
              <Text className="text-base font-semibold text-textPrimary">{group.title}</Text>
              <TouchableOpacity onPress={() => resetGroup(group.id)}>
                <Text className="text-sm font-medium text-primary">Reset</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={group.preferences}
              renderItem={({ item }) => renderPreferenceChip({ item, groupId: group.id })}
              keyExtractor={(item) => item.id}
              horizontal={false}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              className="flex-row flex-wrap"
            />
          </View>
        ))}

        <TouchableOpacity
          className="mt-5 items-center rounded-full bg-accent px-5 py-3"
          onPress={handleSave}>
          <Text className="text-lg font-semibold text-white">Save All Preferences</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        visible={isSuccessAlertVisible}
        title="Success!"
        message="Preferences saved successfully!"
        onClose={handleCloseSuccessAlert}
        confirmButtonText="OK"
      />

      <CustomAlert
        visible={isResetAlertVisible}
        title="Reset Preferences"
        message={`Are you sure you want to reset all preferences in the "${preferenceGroups.find((g) => g.id === resetGroupId)?.title || 'this group'}" group?`}
        onClose={handleCloseResetAlert}
        Close
        onConfirm={handleConfirmReset}
        confirmButtonText="Reset"
      />
    </View>
  );
};

export default Preferences;
