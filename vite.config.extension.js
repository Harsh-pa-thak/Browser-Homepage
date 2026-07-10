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

      // Generate required icon sizes from public/icon.png
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

// Swap specific modules for extension-compatible versions.
// Uses resolveId (Rollup hook) so it intercepts ALL import styles:
// relative ('../GmailWidget/GmailWidget'), @-alias, or absolute path.
function moduleSwapPlugin(swapMap) {
  return {
    name: 'extension-module-swap',
    resolveId(source, importer) {
      if (!importer) return null
      // Resolve the import to an absolute path
      const importerDir = resolve(importer, '..')
      let abs
      try {
        // Try resolving relative and absolute imports
        if (source.startsWith('.')) {
          abs = resolve(importerDir, source)
        } else {
          abs = source
        }
      } catch {
        return null
      }
      // Try matching with and without extension
      for (const [from, to] of Object.entries(swapMap)) {
        if (abs === from || abs + '.jsx' === from || abs + '.js' === from || abs + '.tsx' === from) {
          return to
        }
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    moduleSwapPlugin({
      // Swap GmailWidget with chrome.identity version for extension build
      [resolve(__dirname, 'src/components/GmailWidget/GmailWidget.jsx')]:
        resolve(__dirname, 'extension/components/GmailWidget.ext.jsx'),
    }),
    extensionAssetsPlugin(),
  ],

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
