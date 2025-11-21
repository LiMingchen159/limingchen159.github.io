/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        surface: '#0f172a', // slate-900
        primary: '#e2e8f0', // slate-200
        secondary: '#94a3b8', // slate-400
        accent: '#06b6d4', // cyan-500
        'accent-hover': '#0891b2', // cyan-600
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
