import type {Config} from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        line: 'var(--border)',
        'line-soft': 'var(--border-soft)',
        ink: {
          DEFAULT: 'var(--ink)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
          subtle: 'var(--ink-subtle)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        // Legacy aliases — keep until un-redesigned routes are migrated
        jost: ['var(--font-jost)', 'sans-serif'],
        'roboto-condensed': ['var(--font-roboto-condensed)', 'sans-serif'],
      },
      spacing: {
        '4.5': '18px',
        '5.5': '22px',
        '8.5': '34px',
        '13': '54px',
        notch: 'var(--notch-pad)',
      },
      borderRadius: {
        '4xl': '22px',
        sheet: '28px',
      },
      boxShadow: {
        'card-hover': 'var(--shadow-card-hover)',
        toast: 'var(--shadow-toast)',
        'tab-bar': 'var(--shadow-tab-bar)',
      },
      dropShadow: {
        product: '0 30px 30px rgba(0, 0, 0, 0.2)',
      },
      letterSpacing: {
        'tight-md': '-0.5px',
        'tight-lg': '-0.8px',
        'tight-xl': '-1px',
        'tight-2xl': '-1.5px',
        kicker: '1.2px',
        'kicker-wide': '1.8px',
      },
      keyframes: {
        // Legacy
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
        'glow-drift': {
          '0%, 100%': {transform: 'translate(0, 0) scale(1)'},
          '33%': {transform: 'translate(30px, -20px) scale(1.05)'},
          '66%': {transform: 'translate(-20px, 15px) scale(0.95)'},
        },
        // Redesign 2026
        slideUp: {
          '0%': {transform: 'translateY(100%)'},
          '100%': {transform: 'translateY(0)'},
        },
        slideFromRight: {
          '0%': {transform: 'translateX(100%)', opacity: '0'},
          '100%': {transform: 'translateX(0)', opacity: '1'},
        },
        fadeIn: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
        toastIn: {
          '0%': {transform: 'translateY(120%)', opacity: '0'},
          '100%': {transform: 'translateY(0)', opacity: '1'},
        },
        pop: {
          '0%': {transform: 'scale(0)'},
          '60%': {transform: 'scale(1.15)'},
          '100%': {transform: 'scale(1)'},
        },
        fly: {
          '0%': {
            transform:
              'translate(var(--fx), var(--fy)) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform:
              'translate(var(--tx), var(--ty)) scale(0.15)',
            opacity: '0',
          },
        },
      },
      animation: {
        // Legacy
        float: 'float 6s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'fade-out': 'fade-out 1.5s ease-out forwards',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'glow-drift': 'glow-drift 12s ease-in-out infinite',
        // Redesign 2026
        'slide-up': 'slideUp 0.3s ease',
        'slide-from-right': 'slideFromRight 0.3s ease',
        'fade-in': 'fadeIn 0.2s ease',
        'toast-in': 'toastIn 0.3s cubic-bezier(0.2, 1, 0.3, 1)',
        pop: 'pop 0.5s ease',
        fly: 'fly 0.9s cubic-bezier(0.5, 0, 0.8, 0.3) forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
