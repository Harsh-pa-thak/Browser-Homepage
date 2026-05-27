import { useState, useEffect } from 'react'

const BASE = 'https://alfa-leetcode-api.onrender.com'

export function useLeetCode(username) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return

    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)

    async function load() {
      try {
        const [profileRes, badgesRes, solvedRes, contestRes] = await Promise.all([
          fetch(`${BASE}/${username}/profile`),
          fetch(`${BASE}/${username}/badges`),
          fetch(`${BASE}/${username}/solved`),
          fetch(`${BASE}/${username}/contest`),
        ])

        if (!profileRes.ok) throw new Error(`API ${profileRes.status}`)

        const profile = await profileRes.json()
        const badges = badgesRes.ok ? (await badgesRes.json()).badges || [] : []
        const solved = solvedRes.ok ? await solvedRes.json() : {}
        const contest = contestRes.ok ? await contestRes.json() : {}

        if (!cancelled) {
          setData({ ...profile, ...solved, badges, contest })
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) { setError(e.message); setLoading(false) }
      }
    }

    load()
    return () => { cancelled = true }
  }, [username])

  return { data, loading, error }
}
