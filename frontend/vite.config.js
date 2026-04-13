import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Assessment: Django on 8000. For Express+Mongo instead, use http://localhost:5000.
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
});
