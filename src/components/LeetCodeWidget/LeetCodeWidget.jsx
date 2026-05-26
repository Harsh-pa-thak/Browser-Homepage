import { useLeetCode } from '../../hooks/useLeetCode'
import { env } from '../../config/apiConfig'
import './LeetCodeWidget.css'

function DiffBar({ label, solved, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0
  return (
    <div className="lc-bar-row">
      <span className="lc-bar-label" style={{ color }}>{label}</span>
      <div className="lc-bar-track">
        <div className="lc-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="lc-bar-count">{solved}<span className="lc-bar-total">/{total}</span></span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="lc-widget">
      <div className="lc-sk lc-sk-header" />
      <div className="lc-sk lc-sk-hero" />
      <div className="lc-sk lc-sk-bar" />
      <div className="lc-sk lc-sk-bar" />
      <div className="lc-sk lc-sk-bar" />
    </div>
  )
}

export default function LeetCodeWidget() {
  const username = env.leetcode.username
  const { data, loading, error } = useLeetCode(username)

  if (!username) {
    return (
      <div className="lc-widget lc-state">
        <span className="lc-state-text">Set VITE_LEETCODE_USERNAME in .env</span>
      </div>
    )
  }

  if (loading) return <Skeleton />

  if (error) {
    return (
      <div className="lc-widget lc-state">
        <span className="lc-state-text">Could not load LeetCode data</span>
      </div>
    )
  }

  const totalSolved = data.totalSolved ?? data.solvedProblem ?? 0
  const easySolved  = data.easySolved  ?? 0
  const totalEasy   = data.totalEasy   ?? 0
  const medSolved   = data.mediumSolved ?? 0
  const totalMed    = data.totalMedium  ?? 0
  const hardSolved  = data.hardSolved  ?? 0
  const totalHard   = data.totalHard   ?? data.hardTotal ?? 0
  const ranking     = data.ranking ? `#${Number(data.ranking).toLocaleString()}` : '—'
  const acceptance  = data.acceptanceRate ? `${data.acceptanceRate.toFixed(1)}%` : null

  return (
    <a
      className="lc-widget"
      href={`https://leetcode.com/${username}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="lc-header">
        <div className="lc-brand">
          <img
            src="https://www.google.com/s2/favicons?sz=32&domain=leetcode.com"
            width="16" height="16" alt="LeetCode"
          />
          <span className="lc-brand-name">LeetCode</span>
          <span className="lc-username">@{username}</span>
        </div>
        <span className="lc-rank">{ranking}</span>
      </div>

      <div className="lc-hero">
        <span className="lc-hero-num">{totalSolved}</span>
        <div className="lc-hero-meta">
          <span className="lc-hero-label">solved</span>
          {acceptance && <span className="lc-acceptance">{acceptance} acceptance</span>}
        </div>
      </div>

      <div className="lc-bars">
        <DiffBar label="Easy"   solved={easySolved} total={totalEasy} color="#00b8a3" />
        <DiffBar label="Med"    solved={medSolved}  total={totalMed}  color="#ffa116" />
        <DiffBar label="Hard"   solved={hardSolved} total={totalHard} color="#ef4444" />
      </div>

      {data.badges?.length > 0 && (
        <div className="lc-badges">
          {data.badges.slice(0, 5).map((b, i) => (
            <img
              key={i}
              className="lc-badge"
              src={b.icon}
              alt={b.displayName}
              title={b.displayName}
            />
          ))}
        </div>
      )}
    </a>
  )
}
