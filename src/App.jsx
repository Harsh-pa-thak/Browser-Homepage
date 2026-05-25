import { useState } from 'react'
import Header from './components/Header/Header'
import './App.css'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      {/* Placeholder — components will be added here one by one */}
      <div className="app-body">
        <p className="placeholder-text">Building...</p>
      </div>
    </div>
  )
}
