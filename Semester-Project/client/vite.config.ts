import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: './', // Critical for Mobile: ensures assets load from relative paths
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // transform process.env.API_KEY to the actual string value
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  }
})