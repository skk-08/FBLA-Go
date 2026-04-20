/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary:  '#003087',
        accent:   '#FFD100',
        surface:  '#0A1F5C',
        muted:    '#8A9BB5',
        error:    '#D32F2F',
        success:  '#2E7D32',
        border:   '#1A3A7A',
      },
    },
  },
  plugins: [],
};
