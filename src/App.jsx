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
          {SIMPLE_SITES.map(site => (
            <div key={site.id} style={{ width: 120, height: 120 }}>
              <FlipCard site={site} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
