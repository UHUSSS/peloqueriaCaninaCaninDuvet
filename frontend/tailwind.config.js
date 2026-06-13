/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        surface: {
          50:  '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          700: '#f9fafb',
          800: '#ffffff',
          900: '#FDF2F8',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(236,72,153,0.08), 0 4px 6px -4px rgba(236,72,153,0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
