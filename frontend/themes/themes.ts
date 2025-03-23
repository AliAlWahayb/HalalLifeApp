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
    name: 'Light',
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
  forest: {
    name: 'Forest',
    colors: {
      primary: '#A5D6A7',
      secondary: '#8BC34A',
      background: '#F1F8E9',
      textPrimary: '#2E2E2E',
      textSecondary: '#689F38',
      textMuted: '#757575',
      accent: '#7CB342',
    },
  },
  oceanDark: {
    name: 'Ocean Dark',
    colors: {
      primary: '#4A90E2',
      secondary: '#1976D2',
      background: '#1C1C1E',
      textPrimary: '#E0E0E0',
      textSecondary: '#BBDEFB',
      textMuted: '#9E9E9E',
      accent: '#2196F3',
    },
  },
  vintage: {
    name: 'Vintage',
    colors: {
      primary: '#8E7B68',
      secondary: '#6D4C41',
      background: '#F4ECE4',
      textPrimary: '#303030',
      textSecondary: '#5D4037',
      textMuted: '#795548',
      accent: '#A1887F',
    },
  },
  coralLight: {
    name: 'Coral Light',
    colors: {
      primary: '#FF6347',
      secondary: '#FF5252',
      background: '#FAFAFA',
      textPrimary: '#2D2D2D',
      textSecondary: '#FF867C',
      textMuted: '#BDBDBD',
      accent: '#FF7043',
    },
  },
  royalLight: {
    name: 'Royal Light',
    colors: {
      primary: '#8853C8',
      secondary: '#673AB7',
      background: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#9575CD',
      textMuted: '#9E9E9E',
      accent: '#7E57C2',
    },
  },
} satisfies Record<string, Theme>;

export type ThemeNames = keyof typeof THEMES;
