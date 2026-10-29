/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0D1A16', // фон: нічний карпатський ліс
        ink: '#F2F5F3', // основний текст
        mist: '#A9BDB5', // другорядний текст
        route: { DEFAULT: '#FF7A2F', dark: '#E5621A', light: '#FFB27F' }, // лінія маршруту, головні дії
        fir: { DEFAULT: '#2F8F68', dark: '#22704F', light: '#8FD9B6' }, // карпатська ялина
        gold: '#F5C451', // зірки рейтингу
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1200px',
      },
      boxShadow: {
        glass: '0 20px 60px -20px rgba(0, 0, 0, 0.55)',
      },
    },
  },
  plugins: [],
};
