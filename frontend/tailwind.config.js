/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFB',
        card: '#FFFFFF',
        cardHover: '#F8FAFB',
        primary: '#4480D0',
        primaryHover: '#5092E6',
        secondary: '#93C8EB',
        navy: '#172939',
        darkBlue: '#3D70AE',
        positive: '#22c55e', 
        negative: '#ef4444', 
        neutral: '#8F9DAA',
        text: '#172939',
        muted: '#8F9DAA',
        border: '#E2E8F0', // subtle gray-blue border
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(23, 41, 57, 0.05), 0 1px 2px rgba(23, 41, 57, 0.03)',
        'card': '0 4px 6px -1px rgba(23, 41, 57, 0.05), 0 2px 4px -1px rgba(23, 41, 57, 0.03)',
      }
    },
  },
  plugins: [],
}
