import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve, dirname} from "path";
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      '@components' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/components'
      ),
      '@pages' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/pages'
      ),
      '@components-layouts' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/components/layout'
      ),
      '@components-quiz' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/components/quiz'
      ),
      '@components-ui' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/components/ui'
      ),
      '@assets' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/assets'
      ),
      '@data' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/data'
      ),
      '@hooks' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/hooks'
      ),
      '@constants' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/constants'
      ),
      '@lib' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/lib'
      ),
      '@context' : resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/context'
      ),
    }
  }
})
