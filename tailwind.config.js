/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#809eff',
          500: '#667eea',
          600: '#5568d3',
          700: '#4553bb',
          800: '#3a4599',
          900: '#2f3777',
        },
      },
    },
  },
  plugins: [],
}
