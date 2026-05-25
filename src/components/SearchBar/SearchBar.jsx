import { useState, useRef } from 'react'
import './SearchBar.css'

export default function SearchBar() {
  const [query, setQuery]         = useState('')
  const [listening, setListening] = useState(false)
  const inputRef                  = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`
  }

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r    = new SR()
    r.lang     = 'en-US'
    r.onstart  = () => setListening(true)
    r.onend    = () => setListening(false)
    r.onresult = (e) => { setQuery(e.results[0][0].transcript); inputRef.current?.focus() }
    r.start()
  }

  function handleLens() {
    window.open('https://lens.google.com', '_blank')
  }

  function handleAI() {
    window.open('https://www.google.com/search?udm=50', '_blank')
  }

  return (
    <form id="search-bar" className="search-bar" onSubmit={handleSubmit}>
      <svg className="search-bar-icon" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>

      <input
        ref={inputRef}
        id="search-input"
        className="search-bar-input"
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search Google or type a URL"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="search-bar-actions">
        <button
          id="voice-btn"
          type="button"
          className={`sb-icon-btn ${listening ? 'sb-listening' : ''}`}
          onClick={handleVoice}
          aria-label="Voice search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8"  y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        <button
          id="lens-btn"
          type="button"
          className="sb-icon-btn"
          onClick={handleLens}
          aria-label="Search by image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <circle cx="11" cy="11" r="3"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <button
          id="ai-mode-btn"
          type="button"
          className="sb-ai-btn"
          onClick={handleAI}
          aria-label="AI Mode"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z"/>
          </svg>
          AI Mode
        </button>
      </div>
    </form>
  )
}
