import { useClock } from '../../hooks/useClock'
import './Header.css'

export default function Header({ onSettingsClick }) {
  const { clock, seconds, ampm, day, date } = useClock()

  return (
    <header className="header">

      {/* Left — live clock */}
      <div className="header-clock">
        <span className="clock-main">{clock}</span>
        <span className="clock-seconds">{seconds}</span>
        <span className="clock-ampm">{ampm}</span>
      </div>

      {/* Right — date + settings gear */}
      <div className="header-right">
        <div className="header-date">
          <span className="date-day">{day}</span>
          <span className="date-full">{date}</span>
        </div>

        <button
          id="settings-btn"
          className="icon-btn"
          onClick={onSettingsClick}
          aria-label="Open settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
              a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
              A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
              l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
              A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
              l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
              a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
              l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
              a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

    </header>
  )
}
