import { faviconUrl } from '../../data/sites'
import './FlipCard.css'

export default function FlipCard({ site }) {
  const url = site.isDesktop
    ? (import.meta.env.VITE_DESKTOP_URL || 'file:///home/')
    : site.url

  const logoSrc = site.isDesktop
    ? null
    : (site.logo || faviconUrl(site.url))

  function handleOpen() {
    window.location.href = url
  }

  return (
    <div className="flip-card" id={`tile-${site.id}`}>
      <div className="flip-inner">

        <div className="flip-front">
          {logoSrc
            ? <img className="flip-favicon" src={logoSrc} alt={site.name} width={32} height={32} />
            : <span className="flip-desktop-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </span>
          }
          <span className="flip-name">{site.name}</span>
        </div>

        <div className="flip-back">
          <span className="flip-back-name">{site.name}</span>
          <button className="flip-open-btn" onClick={handleOpen}>
            Open
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}
