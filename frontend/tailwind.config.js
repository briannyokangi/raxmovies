export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
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
      },
      backgroundSize: {
        shimmer: '1000px 100%',
      },
    },
  },
  plugins: [],
};
