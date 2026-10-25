import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Use /withinart/ for GitHub Actions or production builds so images and assets load correctly on GitHub Pages
  base: process.env.GITHUB_ACTIONS ? '/withinart/' : './',
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
