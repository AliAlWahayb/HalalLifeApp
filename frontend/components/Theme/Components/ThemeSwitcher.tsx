// components/Theme/ThemeSwitcher.tsx
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { ThemeNames, THEMES } from 'themes/themes';
import Colors from './Colors';

const ThemeSwitcher = () => {
  const { theme, themeName, setTheme } = useTheme();

  return (
    <View className="p-4" style={{ backgroundColor: theme.colors.background }}>
      <Text className="mb-4 text-xl" style={{ color: theme.colors.textPrimary }}>
        Select Theme
      </Text>

      <FlatList
        data={Object.entries(THEMES)}
        keyExtractor={(item) => item[0]}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => {
          const [key, themeConfig] = item;
          const isActive = themeName === key;

          return (
            <TouchableOpacity
              onPress={() => setTheme(key as ThemeNames)}
              className={`mb-4 rounded-lg p-2 ${isActive ? 'border-2' : ''}`}
              style={{
                borderColor: isActive ? theme.colors.accent : 'transparent',
                width: '30%',
              }}>
              <Colors
                id={key}
                size={16}
                color={[
                  themeConfig.colors.primary,
                  themeConfig.colors.background,
                  themeConfig.colors.textPrimary,
                ]}
              />
              <Text
                className="mt-2 text-center"
                style={{
                  color: isActive ? theme.colors.accent : theme.colors.textMuted,
                  fontWeight: isActive ? 'bold' : 'normal',
                }}>
                {themeConfig.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ThemeSwitcher;
