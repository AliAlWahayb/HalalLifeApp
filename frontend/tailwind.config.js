/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        //global colors
        Halal: 'var(--color-Halal)',
        Haram: 'var(--color-Haram)',
        Unknown: 'var(--color-Unknown)',
        //color mappings
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        textPrimary: 'var(--color-textPrimary)',
        textSecondary: 'var(--color-textSecondary)',
        textMuted: 'var(--color-textMuted)',
        accent: 'var(--color-accent)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      const themes = ['light', 'dark', 'theme2', 'theme3', 'theme4'];
      themes.forEach((theme) => {
        addVariant(`theme-${theme}`, `.theme-${theme} &`);
      });
    },
  ],
};
