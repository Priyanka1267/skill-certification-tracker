import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set `base` to your repository name so assets load correctly on GitHub Pages
export default defineConfig({
  base: '/skill-certification-tracker/',
  plugins: [react()],
})
