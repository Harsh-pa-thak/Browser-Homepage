import { useState, useEffect } from 'react'
import { env } from '../../config/apiConfig'
import './GitHubWidget.css'

const GHIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

function evInfo(type) {
  switch (type) {
    case 'PushEvent': return { icon: '↑', verb: 'pushed to' }
    case 'CreateEvent': return { icon: '+', verb: 'created' }
    case 'WatchEvent': return { icon: '★', verb: 'starred' }
    case 'ForkEvent': return { icon: '⑂', verb: 'forked' }
    case 'PullRequestEvent': return { icon: '⌀', verb: 'opened PR on' }
    case 'IssuesEvent': return { icon: '◎', verb: 'issue on' }
    default: return { icon: '·', verb: 'activity on' }
  }
}

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000)
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.floor(m / 60)}h`
  return `${Math.floor(m / 1440)}d`
}

function Skeleton() {
  return (
    <div className="gh-widget">
      <div className="gh-sk gh-sk-header" />
      <div className="gh-sk gh-sk-graph" />
      <div className="gh-sk gh-sk-stats" />
      <div className="gh-sk gh-sk-events" />
    </div>
  )
}

export default function GitHubWidget() {
  const username = env.github.username
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) { setLoading(false); return }

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then(r => r.json()),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=6`).then(r => r.json()),
    ])
      .then(([prof, evts]) => {
        setProfile(prof)
        setEvents(Array.isArray(evts) ? evts.slice(0, 4) : [])
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [username])

  if (!username) {
    return (
      <div className="gh-widget gh-state">
        <span className="gh-state-text">Set VITE_GITHUB_USERNAME in .env</span>
      </div>
    )
  }

  if (loading) return <Skeleton />

  return (
    <div
      className="gh-widget"
      onClick={() => window.open(`https://github.com/${username}`, '_blank')}
    >
      {/* Header */}
      <div className="gh-header">
        <div className="gh-brand">
          <GHIcon />
          <span className="gh-brand-name">GitHub</span>
          <span className="gh-username">@{username}</span>
        </div>
        {profile && (
          <div className="gh-header-stats">
            <span>{profile.public_repos} repos</span>
            <span className="gh-dot">·</span>
            <span>{profile.followers} followers</span>
          </div>
        )}
      </div>

      {/* Streak / contribution graph */}
      <div className="gh-graph-area">
        <img
          src={`https://streak-stats.demolab.com/?user=${username}&theme=dark&hide_border=true&background=161616&ring=d0d0d0&fire=d0d0d0&currStreakLabel=888888&sideLabels=666666&sideNums=e0e0e0&dates=444444&stroke=16161600`}
          alt="GitHub streak stats"
          className="gh-streak-img"
          loading="lazy"
        />
      </div>


    </div>
  )
}
