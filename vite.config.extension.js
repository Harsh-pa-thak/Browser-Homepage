import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'

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
      copyFileSync(
        resolve(__dirname, 'extension/background.js'),
        resolve(__dirname, 'dist-extension/background.js')
      )

      // Generate all required icon sizes from public/icon.png
      const srcIcon = resolve(__dirname, 'public/icon.png')
      const iconsDir = resolve(__dirname, 'dist-extension/icons')
      mkdirSync(iconsDir, { recursive: true })
      for (const size of [16, 32, 48, 128]) {
        execSync(`magick "${srcIcon}" -resize ${size}x${size} "${iconsDir}/icon${size}.png"`)
      }
      console.log('Extension assets copied.')
    }
  }
}

export default defineConfig({
  plugins: [react(), extensionAssetsPlugin()],

  root: resolve(__dirname, 'extension'),
  publicDir: resolve(__dirname, 'public'),
  base: '',

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
