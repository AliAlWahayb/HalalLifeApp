import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  FlatList,
  Alert,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../comView';
import Header from './Header';

type PreferencesNavigationProp = StackNavigationProp<RootStackParamList, 'Preferences'>;

interface PreferencesProps {
  navigation: PreferencesNavigationProp;
}

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

const Preferences: React.FC<PreferencesProps> = ({ navigation }) => {
  const { theme } = useTheme();

  // Initial preference groups
  const [preferenceGroups, setPreferenceGroups] = useState<PreferenceGroup[]>([
    {
      id: 'dietary',
      title: 'Dietary Preferences',
      preferences: [
        { id: 'halal', label: 'Halal', selected: true },
        { id: 'vegetarian', label: 'Vegetarian', selected: false },
        { id: 'vegan', label: 'Vegan', selected: false },
        { id: 'gluten-free', label: 'Gluten-Free', selected: false },
        { id: 'dairy-free', label: 'Dairy-Free', selected: false },
        { id: 'nut-free', label: 'Nut-Free', selected: false },
        { id: 'organic', label: 'Organic', selected: false },
      ],
    },
    {
      id: 'content',
      title: 'Content Preferences',
      preferences: [
        { id: 'recipes', label: 'Recipes', selected: true },
        { id: 'restaurants', label: 'Restaurants', selected: true },
        { id: 'lifestyle', label: 'Lifestyle', selected: false },
        { id: 'travel', label: 'Travel', selected: false },
        { id: 'health', label: 'Health & Wellness', selected: false },
        { id: 'education', label: 'Education', selected: false },
        { id: 'events', label: 'Events', selected: false },
      ],
    },
    {
      id: 'cuisine',
      title: 'Cuisine Preferences',
      preferences: [
        { id: 'middle-eastern', label: 'Middle Eastern', selected: true },
        { id: 'indian', label: 'Indian', selected: false },
        { id: 'malaysian', label: 'Malaysian', selected: false },
        { id: 'indonesian', label: 'Indonesian', selected: false },
        { id: 'turkish', label: 'Turkish', selected: false },
        { id: 'mediterranean', label: 'Mediterranean', selected: false },
        { id: 'american', label: 'American', selected: false },
        { id: 'african', label: 'African', selected: false },
      ],
    },
  ]);

  // Additional settings
  const [communitySettings, setCommunitySettings] = useState({
    showPostsInFeed: true,
    allowComments: true,
    showDistance: true,
  });

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
    Alert.alert(
      'Reset Preferences',
      'Are you sure you want to reset all preferences in this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setPreferenceGroups((prevGroups) =>
              prevGroups.map((group) => {
                if (group.id === groupId) {
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
          },
        },
      ]
    );
  };

  const toggleCommunitySetting = (setting: keyof typeof communitySettings) => {
    setCommunitySettings({
      ...communitySettings,
      [setting]: !communitySettings[setting],
    });
  };

  const handleSave = () => {
    // In a real app, you would save this to a server
    Alert.alert('Success', 'Preferences saved successfully!');
    navigation.goBack();
  };

  const renderPreferenceChip = ({ item, groupId }: { item: Preference; groupId: string }) => (
    <TouchableOpacity
      style={[
        styles.preferenceChip,
        item.selected
          ? { backgroundColor: theme.colors.primary }
          : { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border },
      ]}
      onPress={() => togglePreference(groupId, item.id)}>
      <Text
        style={[
          styles.preferenceChipText,
          { color: item.selected ? '#FFF' : theme.colors.textPrimary },
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Preferences"
        showBack={true}
        showSearch={false}
        showNotification={false}
        showProfile={false}
        customRightComponent={
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {preferenceGroups.map((group) => (
          <View key={group.id} style={styles.preferenceGroup}>
            <View style={styles.groupHeaderRow}>
              <Text style={[styles.groupTitle, { color: theme.colors.textPrimary }]}>
                {group.title}
              </Text>
              <TouchableOpacity onPress={() => resetGroup(group.id)}>
                <Text style={[styles.resetText, { color: theme.colors.primary }]}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipContainer}>
              <FlatList
                data={group.preferences}
                renderItem={({ item }) => renderPreferenceChip({ item, groupId: group.id })}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.chipList}
              />
            </View>
          </View>
        ))}

        {/* Community Features */}
        <View style={styles.preferenceGroup}>
          <Text style={[styles.groupTitle, { color: theme.colors.textPrimary }]}>
            Community Features
          </Text>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon
                name="stream"
                size={18}
                color={theme.colors.textPrimary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Show Community Posts in Feed
              </Text>
            </View>
            <Switch
              value={communitySettings.showPostsInFeed}
              onValueChange={() => toggleCommunitySetting('showPostsInFeed')}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#767577"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon
                name="comment-alt"
                size={18}
                color={theme.colors.textPrimary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Allow Comments on Your Posts
              </Text>
            </View>
            <Switch
              value={communitySettings.allowComments}
              onValueChange={() => toggleCommunitySetting('allowComments')}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#767577"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon
                name="map-marker-alt"
                size={18}
                color={theme.colors.textPrimary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Show Distance for Nearby Places
              </Text>
            </View>
            <Switch
              value={communitySettings.showDistance}
              onValueChange={() => toggleCommunitySetting('showDistance')}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#767577"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  preferenceGroup: {
    marginBottom: 30,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  preferenceChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    fontSize: 15,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Preferences;
