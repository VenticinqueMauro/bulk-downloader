/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./options.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**"
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
        },
        emerald: {
          300: '#6ee7b7',
          700: '#047857',
          900: '#064e3b',
        },
        rose: {
          300: '#fda4af',
          700: '#be123c',
          900: '#881337',
        },
        blue: {
          300: '#93c5fd',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        yellow: {
          200: '#fef08a',
          300: '#fde047',
          700: '#a16207',
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
