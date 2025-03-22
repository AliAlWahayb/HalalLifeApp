/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Using CSS variables
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        textPrimary: 'var(--color-textPrimary)',
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
