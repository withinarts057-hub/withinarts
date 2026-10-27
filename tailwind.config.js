/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./blocks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
      },
      colors: {
        art: {
          dark: '#0a0b10',
          card: '#12141f',
          accent: '#e67e22',
          gold: '#f39c12',
          rose: '#e84393',
          teal: '#00cec9',
          purple: '#6c5ce7',
          border: 'rgba(255, 255, 255, 0.12)'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(230, 126, 34, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(232, 67, 147, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
