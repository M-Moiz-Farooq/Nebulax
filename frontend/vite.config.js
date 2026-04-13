import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Dev: browser calls same origin /api → Express on 5000 (avoids CORS)
      // Django API (SQLite): use port 8000. Old Node+Mongo backend used 5000.
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
});
