import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

function extensionAssetsPlugin() {
  return {
    name: 'extension-assets',
    closeBundle() {

      copyFileSync(
        resolve(__dirname, 'extension/manifest.json'),
        resolve(__dirname, 'dist-extension/manifest.json')
      )

      copyFileSync(
        resolve(__dirname, 'extension/popup.html'),
        resolve(__dirname, 'dist-extension/popup.html')
      )
      console.log('Extension assets copied.')
    }
  }
}

export default defineConfig({
  plugins: [react(), extensionAssetsPlugin()],

  root: resolve(__dirname, 'extension'),
  publicDir: resolve(__dirname, 'public'),

  build: {
    outDir: resolve(__dirname, 'dist-extension'),
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'extension/index.html'),
        popup: resolve(__dirname, 'extension/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },

  define: {
    'import.meta.env.VITE_BUILD_TARGET': JSON.stringify('extension'),
  }
})
