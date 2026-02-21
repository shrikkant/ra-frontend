import type {Config} from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': {transform: 'translateY(0px)'},
          '50%': {transform: 'translateY(-20px)'},
        },
        'scale-in': {
          '0%': {transform: 'scale(0)', opacity: '0'},
          '50%': {transform: 'scale(1.2)'},
          '100%': {transform: 'scale(1)', opacity: '1'},
        },
        'fade-out': {
          '0%, 70%': {opacity: '1'},
          '100%': {opacity: '0'},
        },
        shimmer: {
          '0%': {transform: 'translateX(-100%)'},
          '100%': {transform: 'translateX(100%)'},
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'fade-out': 'fade-out 1.5s ease-out forwards',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
