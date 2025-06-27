import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        gantt: 'gantt.html'
      }
    }
  },
  server: {
    open: true,
    port: 3000
  },
  publicDir: '../public'
})