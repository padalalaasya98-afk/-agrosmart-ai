/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#2E7D32',
          dark: '#14532D',
          light: '#E8F5E9',
          bg: '#F8FAF5',
          gold: '#F9A825',
          amber: '#D97706',
          emerald: '#059669',
          border: '#E2E8F0',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(46, 125, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -4px rgba(20, 83, 45, 0.07), 0 4px 8px -2px rgba(0, 0, 0, 0.03)',
        'hover': '0 20px 35px -5px rgba(46, 125, 50, 0.15), 0 8px 12px -3px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}
