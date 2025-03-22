import { Theme } from '@nativewind/theme';
import { useTheme } from 'context/ThemeContext';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <Theme.Provider
      value={{
        colors: {
          primary: colors.primary,
          background: colors.background,
          text: colors.text,
          card: colors.card,
          border: colors.border,
        },
      }}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.background,
            '--color-primary': colors.primary,
            '--color-background': colors.background,
            '--color-text': colors.text,
            '--color-card': colors.card,
            '--color-border': colors.border,
          } as any,
        ]}>
        {children}
      </View>
    </Theme.Provider>
  );
};
