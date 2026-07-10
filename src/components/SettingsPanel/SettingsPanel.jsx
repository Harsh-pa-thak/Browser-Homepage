import { useState, useEffect } from 'react'
import { SIMPLE_SITES } from '../../data/sites'
import './SettingsPanel.css'

export default function SettingsPanel({ onClose }) {
  const [ghId, setGhId] = useState('')
  const [lcId, setLcId] = useState('')
  const [siteOverrides, setSiteOverrides] = useState({})

  useEffect(() => {
    setGhId(localStorage.getItem('CUSTOM_GITHUB_ID') || '')
    setLcId(localStorage.getItem('CUSTOM_LEETCODE_ID') || '')
    setSiteOverrides(JSON.parse(localStorage.getItem('CUSTOM_SITES') || '{}'))
  }, [])

  const handleSiteChange = (id, field, value) => {
    setSiteOverrides(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    if (ghId.trim()) localStorage.setItem('CUSTOM_GITHUB_ID', ghId.trim())
    else localStorage.removeItem('CUSTOM_GITHUB_ID')

    if (lcId.trim()) localStorage.setItem('CUSTOM_LEETCODE_ID', lcId.trim())
    else localStorage.removeItem('CUSTOM_LEETCODE_ID')

    if (Object.keys(siteOverrides).length > 0) {
      localStorage.setItem('CUSTOM_SITES', JSON.stringify(siteOverrides))
    } else {
      localStorage.removeItem('CUSTOM_SITES')
    }

    // Force reload to apply new settings to all widgets
    window.location.reload()
  }

  const handleReset = () => {
    localStorage.removeItem('CUSTOM_GITHUB_ID')
    localStorage.removeItem('CUSTOM_LEETCODE_ID')
    localStorage.removeItem('CUSTOM_SITES')
    window.location.reload()
  }

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Homepage Settings</h2>
          <button className="settings-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <section className="settings-section">
            <h3>Widgets</h3>
            <div className="settings-group">
              <label>
                GitHub Username
                <input 
                  type="text" 
                  value={ghId} 
                  onChange={e => setGhId(e.target.value)} 
                  placeholder="e.g. torvalds"
                />
              </label>
            </div>
            <div className="settings-group">
              <label>
                LeetCode Username
                <input 
                  type="text" 
                  value={lcId} 
                  onChange={e => setLcId(e.target.value)} 
                  placeholder="e.g. neetcode"
                />
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h3>Flip Cards</h3>
            <p className="settings-hint">Customize the name, URL, and icon for your flip cards. Icon URL is optional — leave blank to auto-fetch from Google Favicon.</p>
            <div className="settings-sites-grid">
              {SIMPLE_SITES.map(site => {
                const override = siteOverrides[site.id] || {}
                const currentName = override.name !== undefined ? override.name : site.name
                const currentUrl = override.url !== undefined ? override.url : site.url
                const currentIcon = override.customIcon !== undefined ? override.customIcon : ''

                return (
                  <div key={site.id} className="settings-site-row">
                    <span className="site-id-label">{site.name}</span>
                    <input 
                      type="text" 
                      value={currentName} 
                      onChange={e => handleSiteChange(site.id, 'name', e.target.value)}
                      placeholder="Display Name"
                    />
                    <input 
                      type="text" 
                      value={currentUrl} 
                      onChange={e => handleSiteChange(site.id, 'url', e.target.value)}
                      placeholder="URL"
                      disabled={site.isDesktop}
                    />
                    <input
                      type="text"
                      value={currentIcon}
                      onChange={e => handleSiteChange(site.id, 'customIcon', e.target.value)}
                      placeholder="🖼 Custom icon URL (optional)"
                      className="settings-icon-input"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="settings-footer">
          <button className="btn-reset" onClick={handleReset}>Reset to Defaults</button>
          <button className="btn-save" onClick={handleSave}>Save & Apply</button>
        </div>
      </div>
    </div>
  )
}
