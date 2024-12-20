import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist'  // Ensure this is set to 'dist'
  }
})
