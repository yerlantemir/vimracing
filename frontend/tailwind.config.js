/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

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

        'white-1': '#f8f8f8',
        'white-2': '#282c34',
        'white-3': '#e1e1e1',

        'blue-1': '#a7cded',
        'blue-2': '#61afef',
        'blue-3': '#8dc0eb',

        'green-1': '#98c379'
      }
    }
  },
  plugins: []
};
