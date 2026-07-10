
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('[DevDash] Extension installed.')

    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html') + '?firstInstall=true'
    })
  }
})
