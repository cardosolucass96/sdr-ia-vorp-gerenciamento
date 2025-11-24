import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss()
  ],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/functions": path.resolve(__dirname, "./functions"),
    },
  },
  server: {
    proxy: {
      '/api/status': {
        target: process.env.VITE_EVOLUTION_API_URL || 'https://evolution-api.grupovorp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/status/, '/instance/connectionState'),
        headers: {
          'apikey': process.env.VITE_EVOLUTION_API_KEY || '',
        },
      },
      '/api/connect': {
        target: process.env.VITE_EVOLUTION_API_URL || 'https://evolution-api.grupovorp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/connect/, '/instance/connect'),
        headers: {
          'apikey': process.env.VITE_EVOLUTION_API_KEY || '',
        },
      },
    },
  },
})
