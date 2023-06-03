/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        dark: '#282c34',
        'dark-2': '#3c4049',

        gray: '#abb2bf',
        'gray-2': '#c5c8d3',
        'gray-3': '#142446',
        'gray-4': '#32363F',
        'gray-5': '#2B2F38',

        'white-1': '#f8f8f8',
        'white-2': '#282c34',
        'white-3': '#e1e1e1',

        'blue-1': '#a7cded',
        'blue-2': '#61afef',
        'blue-3': '#8dc0eb',

        'green-1': '#98c379',
        'green-2': '#27AE60',
        'green-3': '#2ecc71',

        orange: '#E67E22',

        'red-1': '#e06c75'
      }
    }
  },
  plugins: []
};
