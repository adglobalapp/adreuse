import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fejlesztéskor az /api és /storage kéréseket a Laravel backendhez (php artisan serve) továbbítjuk.
const backend = 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/storage': backend,
    },
  },
});
