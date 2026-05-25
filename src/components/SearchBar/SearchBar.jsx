import { useState, useRef } from 'react'
import './SearchBar.css'

export default function SearchBar() {
  const [query, setQuery]       = useState('')
  const [listening, setListening] = useState(false)
  const inputRef                = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`
  }

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r   = new SR()
    r.lang    = 'en-US'
    r.onstart = () => setListening(true)
    r.onend   = () => setListening(false)
    r.onresult = (e) => {
      const t = e.results[0][0].transcript
      setQuery(t)
      inputRef.current?.focus()
    }
    r.start()
  }

  function handleImage() {
    window.open('https://images.google.com', '_blank')
  }

  return (
    <form id="search-bar" className="search-bar" onSubmit={handleSubmit}>
      <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>

      <input
        ref={inputRef}
        id="search-input"
        className="search-input"
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search Google..."
        autoComplete="off"
        spellCheck="false"
      />

      <div className="search-actions">
        <button
          id="voice-btn"
          type="button"
          className={`search-action-btn ${listening ? 'listening' : ''}`}
          onClick={handleVoice}
          aria-label="Voice search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8"  y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        <button
          id="image-btn"
          type="button"
          className="search-action-btn"
          onClick={handleImage}
          aria-label="Image search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>

        <div className="search-divider" />

        <button id="search-submit-btn" type="submit" className="search-submit">
          Search
        </button>
      </div>
    </form>
  )
}
