import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.API_TARGET || 'http://localhost:5000',
          changeOrigin: true,
          secure: true,
        },
      },
    },
    preview: {
      port: 4174,
      strictPort: true,
    },
  };
});
