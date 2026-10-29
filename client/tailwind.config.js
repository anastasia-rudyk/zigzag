/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B2A2F', // основний текст
        fir: { DEFAULT: '#1F5E4A', dark: '#164536', light: '#DCEBE5' }, // карпатська ялина
        route: { DEFAULT: '#E8590C', dark: '#C2480A', light: '#FDE8DA' }, // лінія маршруту
        mist: '#EEF3F2', // фон
        line: '#CBD8D5', // межі
        slate: { soft: '#5B6E73' }, // другорядний текст
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
};
