function withOpacity(variableName, fallbackHex) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}-rgb), ${opacityValue})`;
    }
    return `var(${variableName}, ${fallbackHex})`;
  };
}

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
          primary: withOpacity('--brand-primary', '#0f2744'),
          'primary-dark': withOpacity('--brand-primary-dark', '#0a192f'),
          'primary-light': withOpacity('--brand-primary-light', '#1e3a5f'),
          secondary: withOpacity('--brand-secondary', '#ffd700'),
          'secondary-dark': withOpacity('--brand-secondary-dark', '#eab308'),
          yellow: withOpacity('--brand-secondary', '#ffd700'),
          gold: withOpacity('--brand-secondary', '#ffd700'),
          'gold-dark': withOpacity('--brand-secondary-dark', '#d4af37'),
          maroon: withOpacity('--brand-primary', '#0f2744'),
          'maroon-dark': withOpacity('--brand-primary-dark', '#0a192f'),
          blue: '#1877f2',
          nav: withOpacity('--brand-nav', '#0a192f'),
          surface: 'var(--brand-surface, #f0f4f9)',
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

