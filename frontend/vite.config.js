import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/Reporter%20World',
        changeOrigin: true,
      },
      '/Reporter World/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/Reporter%20World/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  }
})
