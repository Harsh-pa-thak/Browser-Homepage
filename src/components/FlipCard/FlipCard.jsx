import { useState, useEffect, useRef } from 'react'
import { faviconUrl } from '../../data/sites'
import './FlipCard.css'

export default function FlipCard({ site, initialDelay = 0 }) {
  const [flipped, setFlipped] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const timerRef = useRef(null)

  const url = site.isDesktop
    ? (import.meta.env.VITE_DESKTOP_URL || 'file:///home/')
    : site.url

  const logoSrc = site.isDesktop
    ? null
    : (site.customIcon || site.logo || faviconUrl(site.url))

  useEffect(() => {
    if (hovered) return

    function cycle() {
      timerRef.current = setTimeout(() => {
        setFlipped(true)

        timerRef.current = setTimeout(() => {
          setFlipped(false)
          cycle()
        }, 3000)

      }, Math.random() * 10000 + 8000)
    }

    timerRef.current = setTimeout(cycle, initialDelay)

    return () => clearTimeout(timerRef.current)

  }, [hovered, initialDelay])

  function handleMouseEnter() {
    clearTimeout(timerRef.current)
    setHovered(true)
    setFlipped(true)
  }

  function handleMouseLeave() {
    setHovered(false)
    setFlipped(false)
  }

  function handleClick() {
    window.open(url, "_self")
  }

  return (
    <div
      className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      id={`tile-${site.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flip-inner">

        <div className="flip-front">

          {site.isDesktop ? (
            <div className="flip-desktop-wrap">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>

          ) : imgFailed ? (

            <span className="flip-initial">
              {site.name[0]}
            </span>

          ) : (

            <img
              className={`flip-logo ${site.fullBleed ? 'full' : ''}`}
              src={logoSrc}
              alt={site.name}
              onError={() => setImgFailed(true)}
            />

          )}

        </div>

        <div className="flip-back">
          <span className="flip-back-name">
            {site.name}
          </span>

          <span className="flip-back-arrow">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>

        </div>

      </div>
    </div>
  )
}