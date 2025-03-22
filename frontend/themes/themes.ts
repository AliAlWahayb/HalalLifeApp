// themes.ts
export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
};

export const THEMES = {
  light: {
    name: 'light',
    colors: {
      primary: '#007AFF',
      secondary: '#34C759',
      background: '#FFFFFF',
      text: '#1C1C1E',
      accent: '#FF9500',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#0A84FF',
      secondary: '#32D74B',
      background: '#000000',
      text: '#FFFFFF',
      accent: '#FF9F0A',
    },
  },
  // Add 3 more themes here
} satisfies Record<string, Theme>;

export type ThemeNames = keyof typeof THEMES;
