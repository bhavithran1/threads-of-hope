import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages repo path: https://<user>.github.io/threads-of-hope/
export default defineConfig({
  base: '/threads-of-hope/',
  plugins: [react()],
  server: { port: 5180, open: false }
})
