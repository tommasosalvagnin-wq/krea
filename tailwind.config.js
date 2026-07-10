/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a2a4a',
        secondary: '#0f1428',
        accent: '#4a5568',
        'accent-light': '#2d3748',
        'text-main': '#e0e7ff',
        cyan: '#00d4ff',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
