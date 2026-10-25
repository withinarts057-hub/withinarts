import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './components'),
      '@/blocks': path.resolve(__dirname, './blocks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
