/**
 * App.ext.jsx — Extension version of App
 *
 * Uses BentoGrid.ext.jsx (which pulls in chrome.identity Gmail)
 * instead of the web version. Everything else is identical.
 */

import { useState } from 'react'
import Header from '@/components/Header/Header'
import BentoGrid from './BentoGrid.ext'        // ← extension BentoGrid
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel'
import '@/App.css'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <div className="app-body">
        <BentoGrid />
      </div>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      <footer className="app-footer">
        <p>Browser is a developer homepage for quick access to bookmarks, web search, and configuration.</p>
      </footer>
    </div>
  )
}
