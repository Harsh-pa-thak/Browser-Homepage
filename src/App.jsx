import { useState } from 'react'
import Header from './components/Header/Header'
import FlipCard from './components/FlipCard/FlipCard'
import { SIMPLE_SITES } from './data/sites'
import './App.css'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      <div className="app-body">
        <div className="flip-preview-grid">
          {SIMPLE_SITES.map((site, i) => (
            <div key={site.id} style={{ width: 130, height: 130 }}>
              <FlipCard site={site} initialDelay={i * 900} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
