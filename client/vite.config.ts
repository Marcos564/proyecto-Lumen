import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Deno from '@deno/vite-plugin'

export default defineConfig({
  plugins: [react(), tailwindcss(), Deno()],
})
