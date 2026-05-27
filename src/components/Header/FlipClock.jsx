import { useState, useEffect } from 'react'
import './FlipClock.css'

function FC({ value, label }) {
  const [curr, setCurr] = useState(value)
  const [prev, setPrev] = useState(value)
  const [anim, setAnim] = useState(null)

  useEffect(() => {
    if (value === curr) return

    setPrev(curr)
    setAnim('fall')

    const t1 = setTimeout(() => { setCurr(value); setAnim('rise') }, 280)
    const t2 = setTimeout(() => { setAnim(null) }, 560)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [value])


  const staticTop = anim === 'fall' ? value : curr
  const staticBot = anim === 'fall' ? prev : curr

  return (
    <div className="fc-wrap">

      <div className="fc-card">
        <div className="fc-half fc-half-top">
          <div className="fc-digit">{staticTop}</div>
        </div>

        <div className="fc-split-line" />

        <div className="fc-half fc-half-bot">
          <div className="fc-digit fc-digit-shift">{staticBot}</div>
        </div>
      </div>

      {anim === 'fall' && (
        <div className="fc-flap fc-flap-top fc-anim-fall">
          <div className="fc-digit">{prev}</div>
        </div>
      )}

      {anim === 'rise' && (
        <div className="fc-flap fc-flap-bot fc-anim-rise">
          <div className="fc-digit fc-digit-shift">{curr}</div>
        </div>
      )}

      {label && <span className="fc-label">{label}</span>}
    </div>
  )
}

export default function FlipClock({ hh, mm, ampm }) {
  return (
    <div className="flip-clock-row">
      <FC value={hh} />
      <div className="fc-colon">:</div>
      <FC value={mm} label={ampm} />
    </div>
  )
}
