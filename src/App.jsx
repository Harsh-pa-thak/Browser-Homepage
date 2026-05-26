import { useState } from 'react'
import Header from './components/Header/Header'
import BentoGrid from './components/BentoGrid/BentoGrid'
import './App.css'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <div className="app-body">
        <BentoGrid />
      </div>
    </div>
  )
}
