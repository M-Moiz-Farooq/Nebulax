import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Dev: browser calls /api → Express (default PORT 5000). For Django instead, use 8000.
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
