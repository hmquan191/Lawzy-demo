import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/pdf-worker': {
        target: 'http://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.js',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf-worker/, '')
      }
    }
  }
})
