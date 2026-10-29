import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Під час розробки запити /api перенаправляються на Express-сервер
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
