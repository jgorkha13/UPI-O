/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        brand: {
          DEFAULT: '#1e40af', // Deep Trust Navy / Blue
          dark: '#1e3a8a',
          light: '#2563eb',
          soft: 'var(--color-brand-soft)',
        },
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          blue: '#2563eb',
        },
        success: '#059669', // Emerald
        danger: '#dc2626',  // Red 600
        warning: '#d97706', // Amber 600
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        heading: '-0.015em',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '14px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        glow: 'none',
        'glow-btn': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow-btn-hover': '0 2px 4px 0 rgb(0 0 0 / 0.08)',
        'focus-ring': '0 0 0 2px rgba(37, 99, 235, 0.2)',
        nav: '0 -1px 3px 0 rgb(0 0 0 / 0.04)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease forwards',
        'slide-up': 'slideUp 250ms ease forwards',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

