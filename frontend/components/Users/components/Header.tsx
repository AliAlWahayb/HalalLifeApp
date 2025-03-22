import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'themes/ThemeProvider';

const Header = () => {
  const { theme } = useTheme();
  return (
    <View className="absolute left-0 right-0 top-0 z-10 mr-4">
      <Svg width="393" height="75" viewBox="0 0 393 75" fill="none">
        <Circle cx="2" cy="27" r="30" stroke={theme.colors.accent} strokeWidth="36" />
        <Circle cx="77.5" cy="-16.5" r="82.5" fill={theme.colors.accent} />
        <Circle cx="388.5" cy="-18.5" r="90.5" fill={theme.colors.accent} />
      </Svg>
    </View>
  );
};

export default Header;
