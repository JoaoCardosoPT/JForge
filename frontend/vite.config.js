import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load the env withouth exposing the variables to the client
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.API_TARGET || 'http://localhost:5000',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
});