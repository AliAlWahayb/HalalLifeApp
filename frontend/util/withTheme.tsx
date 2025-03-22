// utils/withTheme.tsx
import { View } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { Theme } from 'themes/themes';

type WithThemeProps = {
  theme: Theme;
};

export const withTheme = <P extends object>(Component: React.ComponentType<P & WithThemeProps>) => {
  return (props: P) => {
    const { theme, themeName } = useTheme();

    return (
      <View className={`theme-${themeName} flex-1`}>
        <Component {...props} theme={theme} themeName={themeName} />
      </View>
    );
  };
};
