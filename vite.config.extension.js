import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

// Plugin to copy manifest.json and extension assets to output
function extensionAssetsPlugin() {
  return {
    name: 'extension-assets',
    closeBundle() {
      // Copy manifest
      copyFileSync(
        resolve(__dirname, 'extension/manifest.json'),
        resolve(__dirname, 'dist-extension/manifest.json')
      )
      // Copy popup html
      copyFileSync(
        resolve(__dirname, 'extension/popup.html'),
        resolve(__dirname, 'dist-extension/popup.html')
      )
      console.log('✅ Extension assets copied.')
    }
  }
}

export default defineConfig({
  plugins: [react(), extensionAssetsPlugin()],

  // Use extension/index.html as the main entry (new tab / homepage)
  root: resolve(__dirname, 'extension'),
  publicDir: resolve(__dirname, 'public'),

  build: {
    outDir: resolve(__dirname, 'dist-extension'),
    emptyOutDir: true,

    rollupOptions: {
      input: {
        // Full app — used by new tab & homepage
        main: resolve(__dirname, 'extension/index.html'),
        // Compact popup — shown when clicking extension icon
        popup: resolve(__dirname, 'extension/popup.html'),
      },
      output: {
        // No hash-based file names — extensions load files by name
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  },

  resolve: {
    alias: {
      // Allow extension entry files to import from src/
      '@': resolve(__dirname, 'src'),
    }
  },

  define: {
    // Build-time flag so components know they're in extension context
    'import.meta.env.VITE_BUILD_TARGET': JSON.stringify('extension'),
  }
})
