export const GLOBAL_COLORS = {
  Halal: '#77C273',
  Haram: '#F76666',
  Unknown: '#F7B766',
  Muted: '#6B7280',
} as const;

export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
  };
};

export const THEMES = {
  light: {
    name: 'light',
    colors: {
      primary: '#5FCE59',
      secondary: '#61A55D',
      background: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#ffffff',
      textMuted: '#6b7280',
      accent: '#77C273',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#e5ff00',
      secondary: '#ff0000',
      background: '#ff0000',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      textMuted: '#999999',
      accent: '#ff0000',
    },
  },
} satisfies Record<string, Theme>;

export type ThemeNames = keyof typeof THEMES;
