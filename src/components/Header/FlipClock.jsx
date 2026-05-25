import { useState, useEffect } from 'react'
import { useClock } from '../../hooks/useClock'
import './FlipClock.css'

// ─── Single digit flip card ─────────────────────────────────
function FC({ value, label }) {
  const [curr, setCurr] = useState(value)
  const [prev, setPrev] = useState(value)
  const [anim, setAnim] = useState(null) // null | 'fall' | 'rise'

  useEffect(() => {
    if (value === curr) return

    setPrev(curr)
    setAnim('fall')

    // Phase 1 done → update bottom static, start rise
    const t1 = setTimeout(() => { setCurr(value); setAnim('rise') }, 280)
    // Phase 2 done → idle
    const t2 = setTimeout(() => { setAnim(null) }, 560)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [value])

  // During 'fall':
  //   static top    → new value  (already showing what's coming)
  //   static bottom → old value  (hasn't changed yet)
  //   flap top      → old value, rotates 0 → -90deg (falls away)
  // During 'rise':
  //   curr is updated to new value
  //   flap bottom   → new value, rotates 90 → 0deg (unfolds in)
  const staticTop = anim === 'fall' ? value : curr
  const staticBot = anim === 'fall' ? prev  : curr

  return (
    <div className="fc-wrap">

      {/* ── Static card (always visible) ── */}
      <div className="fc-card">
        <div className="fc-half fc-half-top">
          <div className="fc-digit">{staticTop}</div>
        </div>

        <div className="fc-split-line" />

        <div className="fc-half fc-half-bot">
          <div className="fc-digit fc-digit-shift">{staticBot}</div>
        </div>
      </div>

      {/* ── Phase 1: old top flap falls forward ── */}
      {anim === 'fall' && (
        <div className="fc-flap fc-flap-top fc-anim-fall">
          <div className="fc-digit">{prev}</div>
        </div>
      )}

      {/* ── Phase 2: new bottom flap rises up ── */}
      {anim === 'rise' && (
        <div className="fc-flap fc-flap-bot fc-anim-rise">
          <div className="fc-digit fc-digit-shift">{curr}</div>
        </div>
      )}

      {label && <span className="fc-label">{label}</span>}
    </div>
  )
}

// ─── Full flip clock ─────────────────────────────────────────
export default function FlipClock() {
  const { clock, ampm, day, date } = useClock()
  const [hh, mm] = clock.split(':')

  return (
    <div className="flip-clock">
      <div className="flip-clock-row">
        <FC value={hh} />
        <div className="fc-colon">:</div>
        <FC value={mm} label={ampm} />
      </div>

      <div className="flip-clock-date">
        <span className="fc-day">{day}</span>
        <span className="fc-dot">·</span>
        <span className="fc-date">{date}</span>
      </div>
    </div>
  )
}
