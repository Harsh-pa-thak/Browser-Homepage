import { useState, useEffect } from 'react'

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const h = now.getHours()
  const h12 = h % 12 || 12

  return {
    clock:   `${pad(h12)}:${pad(now.getMinutes())}`,
    seconds: pad(now.getSeconds()),
    ampm:    h >= 12 ? 'PM' : 'AM',
    day:     now.toLocaleDateString('en-GB', { weekday: 'long' }),
    date:    now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}
