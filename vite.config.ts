import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3002,
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
          },
          '/uploads': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
