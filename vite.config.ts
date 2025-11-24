import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
          target: env.EVOLUTION_API_URL || 'https://evolution-api.grupovorp.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/status/, '/instance/connectionState'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('apikey', env.EVOLUTION_API_KEY || '');
            });
          },
        },
        '/api/connect': {
          target: env.EVOLUTION_API_URL || 'https://evolution-api.grupovorp.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/connect/, '/instance/connect'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('apikey', env.EVOLUTION_API_KEY || '');
            });
          },
        },
      },
    },
  };
})
