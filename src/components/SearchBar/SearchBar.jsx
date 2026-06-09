import { useState, useRef, useEffect, useCallback } from 'react'
import './SearchBar.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  const fetchSuggestions = useCallback((q) => {
    if (!q.trim()) { setSuggestions([]); setShowDropdown(false); return }
    const cbName = `__gsc_${Date.now()}`
    const script = document.createElement('script')
    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}&callback=${cbName}`
    window[cbName] = (data) => {
      setSuggestions(data[1]?.slice(0, 8) ?? [])
      setShowDropdown(true)
      setActiveIndex(-1)
      delete window[cbName]
      script.remove()
    }
    script.onerror = () => { delete window[cbName]; script.remove() }
    document.head.appendChild(script)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setSuggestions([]); setShowDropdown(false); return }
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200)
  }

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function navigate(q) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q.trim())}`
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigate(suggestions[activeIndex])
    } else if (query.trim()) {
      navigate(query)
    }
  }

  function handleKeyDown(e) {
    if (!showDropdown || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveIndex(-1)
    }
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
    <div ref={wrapperRef} className="search-bar-wrapper">
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
          value={activeIndex >= 0 ? suggestions[activeIndex] : query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true) }}
          placeholder="Search Google or type a URL"
          autoComplete="off"
          spellCheck="false"
          autoFocus
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
              <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
            </svg>
          </button>

          <button
            id="lens-btn"
            type="button"
            className="sb-icon-btn"
            onClick={handleLens}
            aria-label="Search by image"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="#5f6368" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="#5f6368" strokeWidth="1.4" />
              <circle cx="12" cy="12" r="1.5" fill="#4285f4" />
              <path d="M3 8.5 V6 Q3 5 4 5 H6.5" stroke="#4285f4" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M21 8.5 V6 Q21 5 20 5 H17.5" stroke="#ea4335" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M3 15.5 V18 Q3 19 4 19 H6.5" stroke="#34a853" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M21 15.5 V18 Q21 19 20 19 H17.5" stroke="#fbbc04" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
          <button
            id="ai-mode-btn"
            type="button"
            className="sb-ai-btn"
            onClick={handleAI}
            aria-label="AI Mode"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285f4" />
                  <stop offset="40%" stopColor="#9b72cb" />
                  <stop offset="100%" stopColor="#ea4335" />
                </linearGradient>
              </defs>
              <path d="M10 1 C10.4 4.5 13 7.6 16.5 8 C13 8.4 10.4 11.5 10 15 C9.6 11.5 7 8.4 3.5 8 C7 7.6 9.6 4.5 10 1 Z" fill="url(#gem-grad)" />
              <path d="M16.5 13.5 C16.65 14.6 17.4 15.35 18.5 15.5 C17.4 15.65 16.65 16.4 16.5 17.5 C16.35 16.4 15.6 15.65 14.5 15.5 C15.6 15.35 16.35 14.6 16.5 13.5 Z" fill="#fbbc04" />
            </svg>
            AI Mode
          </button>
        </div>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="sb-suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === activeIndex}
              className={`sb-suggestion-item ${i === activeIndex ? 'sb-suggestion-active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); navigate(s) }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <svg className="sb-suggestion-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
