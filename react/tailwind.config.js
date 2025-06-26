/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        product: ['Inter', 'sans-serif'],
      },
      colors: {
        'lawzy-orange': '#fc8e5a',
        'lawzy-bg': '#fefff9',
      },
      fontWeight: {
        normal: '400',
        regular: '500',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 