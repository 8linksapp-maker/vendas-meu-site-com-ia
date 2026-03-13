/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    '#080810',
        surface: '#111118',
        border:  '#1E1E2E',
        indigo:  '#6366F1',
        'indigo-light': '#818CF8',
        'indigo-glow':  '#A5B4FC',
        muted:   '#6B7280',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366F1 0%, #A5B4FC 100%)',
      },
    },
  },
  plugins: [],
};
