//Higher-Order Componen (Theme Provider) HOC
import React, { createContext, useContext, useState } from 'react';

import { THEMES, Theme, ThemeNames, GLOBAL_COLORS } from './themes';

type ThemeContextType = {
  theme: Theme;
  themeName: ThemeNames;
  globalColors: typeof GLOBAL_COLORS;
  setTheme: (name: ThemeNames) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeNames>('light');
  const theme = THEMES[themeName];

  const setTheme = (name: ThemeNames) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, globalColors: GLOBAL_COLORS, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
