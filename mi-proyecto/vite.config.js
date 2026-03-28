import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las llamadas a /cf-api/* se redirigen a Cloudflare en el servidor
      // (sin CORS porque la petición sale del servidor, no del navegador)
      '/cf-api': {
        target: 'https://api.cloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cf-api/, ''),
        secure: true,
      },
    },
  },
})
