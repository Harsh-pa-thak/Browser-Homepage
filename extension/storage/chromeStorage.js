/**
 * chromeStorage.js
 *
 * Drop-in async wrapper around chrome.storage.local.
 * The extension uses this instead of localStorage — tokens and settings
 * are sandboxed to this extension and never accessible from web pages.
 *
 * API mirrors localStorage for easy migration:
 *   getItem(key)           → Promise<string | null>
 *   setItem(key, value)    → Promise<void>
 *   removeItem(key)        → Promise<void>
 *   getAll()               → Promise<object>
 */

export const chromeStorage = {
  getItem(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] ?? null)
      })
    })
  },

  setItem(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve)
    })
  },

  removeItem(key) {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], resolve)
    })
  },

  getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, resolve)
    })
  },

  clear() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve)
    })
  }
}
