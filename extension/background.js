/**
 * background.js — Extension Service Worker
 *
 * Handles background tasks for the DevDash extension:
 * - Sets up context menus on install
 * - Handles token refresh requests from content/popup
 */

// Open the full homepage when the extension icon is clicked
// (popup.html handles the click — this is just a fallback listener)
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('[DevDash] Extension installed.')

    // Show the user how to set their homepage on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html') + '?firstInstall=true'
    })
  }
})
