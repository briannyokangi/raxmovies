export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050B18',
          900: '#0F1A2B',
          800: '#1A2A42',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        blue: {
          500: '#2563EB',
          600: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {
        'poster': '2 / 3',
        'banner': '16 / 9',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundSize: {
        shimmer: '1000px 100%',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-sky': '0 0 20px rgba(56, 189, 248, 0.2)',
      },
    },
  },
  plugins: [],
};
