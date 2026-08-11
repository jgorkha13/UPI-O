/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#f4f6fb',
          secondary: '#ffffff',
          tertiary: '#eef1f8',
        },
        brand: {
          DEFAULT: '#5f259f',
          dark: '#4a1d7a',
          light: '#7b3fbf',
          soft: '#f3ebff',
        },
        accent: {
          DEFAULT: '#5f259f',
          hover: '#4a1d7a',
          blue: '#2563eb',
        },
        success: '#00a651',
        danger: '#e53935',
        warning: '#f59e0b',
        text: {
          primary: '#1a1a2e',
          secondary: '#64748b',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        heading: '0.3px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(95, 37, 159, 0.08)',
        'card-hover': '0 8px 32px rgba(95, 37, 159, 0.14)',
        glow: '0 0 20px rgba(95, 37, 159, 0.15)',
        'glow-btn': '0 4px 16px rgba(95, 37, 159, 0.35)',
        'glow-btn-hover': '0 8px 24px rgba(95, 37, 159, 0.45)',
        'focus-ring': '0 0 0 3px rgba(95, 37, 159, 0.15)',
        nav: '0 -4px 24px rgba(0, 0, 0, 0.08)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 400ms ease forwards',
        'slide-up': 'slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        shake: 'shake 400ms ease-in-out',
        float: 'float 12s ease-in-out infinite',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%, 75%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(24px, -24px)' },
        },
      },
    },
  },
  plugins: [],
};
