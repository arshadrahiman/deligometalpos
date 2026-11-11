/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: '#8d2c24',
          'maroon-dark': '#6e211b',
          blue: '#1877f2',
          gold: '#ffd700',
          'gold-dark': '#d4af37',
          nav: '#302929',
          surface: '#f4f6f9',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lobster: ['Lobster', 'cursive'],
        receipt: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}

