import { useState } from 'react'
import Header from './components/Header/Header'
import SearchBar from './components/SearchBar/SearchBar'
import './App.css'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <SearchBar />

      <div className="app-body">
        <p className="placeholder-text">Bento grid coming next...</p>
      </div>
    </div>
  )
}
