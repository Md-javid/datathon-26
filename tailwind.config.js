/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#F1C40F',
          500: '#D4AF37',
          600: '#B8860B',
        }
      }
    },
  },
  plugins: [],
}
