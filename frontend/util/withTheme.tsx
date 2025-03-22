// utils/withTheme.tsx
import { View } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

export const withTheme =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    const { themeName } = useTheme();

    return (
      <View className={`theme-${themeName} flex-1`}>
        <Component {...props} />
      </View>
    );
  };