/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', dark: '#1d4ed8', light: '#dbeafe' },
        secondary: { DEFAULT: '#10B981', light: '#d1fae5' },
        accent: { DEFAULT: '#F59E0B', light: '#fef3c7' },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
