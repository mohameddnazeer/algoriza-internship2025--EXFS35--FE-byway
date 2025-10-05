import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  define: {
    __API__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:5041/api/v1')
  }
})
