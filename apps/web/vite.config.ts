import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy:{
      "/api/image": "http://localhost:8181",
      "/api/pdf": "http://localhost:8181",
    }
  }
})
