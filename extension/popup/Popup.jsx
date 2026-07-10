import { useState, useEffect } from 'react'
import { SITES } from '@/data/sites'
import { faviconUrl } from '@/data/sites'
import './Popup.css'

// Only flip card sites, not widget-type sites
const SHORTCUT_SITES = SITES.filter(s => s.type !== 'widget' && !s.isDesktop)

function ShortcutTile({ site }) {
  const [imgFailed, setImgFailed] = useState(false)
  const logoSrc = site.customIcon || site.logo || faviconUrl(site.url)

  function handleClick() {
    chrome.tabs.create({ url: site.url })
    window.close()
  }

  return (
    <button className="popup-tile" onClick={handleClick} title={site.name}>
      <div className="popup-tile-icon">
        {imgFailed ? (
          <span className="popup-tile-initial">{site.name[0]}</span>
        ) : (
          <img
            src={logoSrc}
            alt={site.name}
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <span className="popup-tile-name">{site.name}</span>
    </button>
  )
}

export default function Popup() {
  function openHome() {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
    window.close()
  }

  return (
    <div className="popup-root">
      <div className="popup-header">
        <span className="popup-logo">⚡</span>
        <span className="popup-title">DevDash</span>
        <button className="popup-home-btn" onClick={openHome} title="Open full homepage">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12L12 3l9 9"/>
            <path d="M9 21V12h6v9"/>
          </svg>
        </button>
      </div>

      <div className="popup-grid">
        {SHORTCUT_SITES.map(site => (
          <ShortcutTile key={site.id} site={site} />
        ))}
      </div>

      <div className="popup-footer">
        <button className="popup-settings-btn" onClick={() => {
          chrome.tabs.create({ url: chrome.runtime.getURL('index.html') + '#settings' })
          window.close()
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          Settings
        </button>
      </div>
    </div>
  )
}
