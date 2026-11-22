import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [tailwindcss()],
  build: { rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), about: resolve(import.meta.dirname, 'about.html'), services: resolve(import.meta.dirname, 'services.html'), work: resolve(import.meta.dirname, 'work.html'), expertise: resolve(import.meta.dirname, 'expertise.html'), project: resolve(import.meta.dirname, 'project-car-rental.html') } } },
})
