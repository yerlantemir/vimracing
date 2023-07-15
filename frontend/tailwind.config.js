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

        text: '#abb2bf',

        primary: '#e67e22',

        secondary: '#293141',

        background: '#282c34'
      }
    }
  },
  plugins: []
};
