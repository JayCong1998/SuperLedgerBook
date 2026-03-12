/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // 蓝色
        secondary: '#10b981', // 绿色
        accent: '#f59e0b', // 黄色
        'dark-bg': '#1e293b',
        'dark-card': '#334155',
        'dark-text': '#f8fafc',
        'light-bg': '#f8fafc',
        'light-card': '#ffffff',
        'light-text': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}