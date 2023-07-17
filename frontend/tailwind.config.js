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

        text: 'var(--color-text)',

        primary: 'var(--color-primary)',

        secondary: 'var(--color-secondary)',

        background: 'var(--color-background)'
      }
    }
  },
  plugins: []
};
