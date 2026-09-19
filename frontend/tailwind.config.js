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
          DEFAULT: '#4F46E5', // Indigo-600
          foreground: '#FFFFFF',
        },
        background: '#F9FAFB', // Gray-50
        card: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
