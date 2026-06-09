import { useState, useRef } from 'react'
import './SearchBar.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`
  }

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = 'en-US'
    r.interimResults = false
    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
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
        autoFocus="true"
      />

      <div className="search-bar-actions">
        <button
          id="voice-btn"
          type="button"
          className={`sb-icon-btn ${listening ? 'sb-listening' : ''}`}
          onClick={handleVoice}
          aria-label="Voice search"
        >
          <svg focusable="false" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
            <path fill="#34a853" d="m12 18.08h2v3.92h-2z"></path>
            <path fill="#fbbc04" d="m9 16.87c-1.27-1.33-2.05-2.8-2.05-4.67h-2c0 2.6 1.47 4.81 3.65 6.18v0.03z"></path>
            <path fill="#ea4335" d="m13 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
          </svg>
        </button>

        <button
          id="lens-btn"
          type="button"
          className="sb-icon-btn"
          onClick={handleLens}
          aria-label="Search by image"
        >
          <svg focusable="false" viewBox="0 0 192 192" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <rect fill="none" height="192" width="192"></rect>
            <g>
              <circle cx="96" cy="96" fill="#4285f4" r="14"></circle>
              <circle cx="152" cy="152" fill="#34a853" r="8"></circle>
              <path d="m134 68c-12.15 0-22-9.85-22-22v-6h-24v6c0 23.2-18.8 42-42 42h-6v24h6c12.15 0 22 9.85 22 22v6h24v-6c0-23.2 18.8-42 42-42h6v-24h-6z" fill="#fbbc04"></path>
              <path d="m40 76h6c23.2 0 42-18.8 42-42v-6h-24v6c0 12.15-9.85 22-22 22h-6v24z" fill="#ea4335"></path>
              <path d="m112 40v-6h-24v6c0 23.2 18.8 42 42 42h6v-24h-6c-12.15 0-22-9.85-22-22z" fill="#4285f4"></path>
              <path d="m134 116c-12.15 0-22 9.85-22 22v6h24v-6c0-23.2 18.8-42 42-42h6v24h-6c-23.2 0-42 18.8-42 42z" fill="#34a853"></path>
              <path d="m88 152v6h24v-6c0-23.2-18.8-42-42-42h-6v24h6c12.15 0 22 9.85 22 22z" fill="#ea4335"></path>
            </g>
          </svg>
        </button>

        <button
          id="ai-mode-btn"
          type="button"
          className="sb-ai-btn"
          onClick={handleAI}
          aria-label="AI Mode"
        >
          <svg focusable="false" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.7 13.3c-1.3-1.4-2-3.1-2-4.9 0-1.8.7-3.5 2-4.9.4-.4.4-1 0-1.4-1.4-1.3-3.1-2-4.9-2-1.8 0-3.5.7-4.9 2-1.3 1.4-2 3.1-2 4.9 0 1.8.7 3.5 2 4.9 1.4 1.3 3.1 2 4.9 2 1.8 0 3.5-.7 4.9-2 .4-.4.4-1 0-1.4z" fill="#4285f4" />
            <path d="M10.1 19.3c-1.2-1.3-1.8-3-1.8-4.8 0-1.8.6-3.4 1.8-4.8.4-.4.4-1 0-1.4-1.3-1.2-2.9-1.9-4.7-1.9-1.8 0-3.4.6-4.7 1.9-1.2 1.3-1.8 3-1.8 4.8 0 1.8.6 3.4 1.8 4.8 1.3 1.2 2.9 1.9 4.7 1.9 1.8 0 3.4-.6 4.7-1.9.4-.4.4-1 0-1.4z" fill="#ea4335" />
            <path d="M14.6 23.3c-.9-1-1.3-2.3-1.3-3.6 0-1.3.5-2.6 1.3-3.6.3-.3.3-.8 0-1-1-.9-2.3-1.4-3.6-1.4-1.3 0-2.6.5-3.6 1.4-.9 1-1.3 2.3-1.3 3.6 0 1.3.5 2.6 1.3 3.6.3.3.3.8 0 1 1 .9 2.3 1.4 3.6 1.4 1.3 0 2.6-.5 3.6-1.4.3-.3.3-.8 0-1z" fill="#fbbc04" />
          </svg>
          AI Mode
        </button>
      </div>
    </form>
  )
}
