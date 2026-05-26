import { useLeetCode } from '../../hooks/useLeetCode'
import { env } from '../../config/apiConfig'
import './LeetCodeWidget.css'

const R = 42, CX = 55, CY = 55
const CIRC = 2 * Math.PI * R
const GAUGE = CIRC * 0.75

function DonutChart({ easy, medium, hard }) {
  const total = easy + medium + hard
  const easyLen = total > 0 ? (easy   / total) * GAUGE : 0
  const medLen  = total > 0 ? (medium / total) * GAUGE : 0
  const hardLen = total > 0 ? (hard   / total) * GAUGE : 0

  const seg = (offset, len, color) => (
    <circle
      cx={CX} cy={CY} r={R}
      fill="none"
      stroke={color}
      strokeWidth={7}
      strokeLinecap="round"
      strokeDasharray={`${len} ${CIRC - len}`}
      strokeDashoffset={CIRC - offset}
      transform={`rotate(-135, ${CX}, ${CY})`}
    />
  )

  return (
    <svg viewBox="0 0 110 110" style={{ width: '100%', height: '100%', display: 'block' }}>
      <circle
        cx={CX} cy={CY} r={R}
        fill="none"
        stroke="#252525"
        strokeWidth={7}
        strokeDasharray={`${GAUGE} ${CIRC - GAUGE}`}
        strokeDashoffset={CIRC}
        transform={`rotate(-135, ${CX}, ${CY})`}
      />
      {seg(0, easyLen, '#00b8a3')}
      {seg(easyLen, medLen, '#ffa116')}
      {seg(easyLen + medLen, hardLen, '#ef4444')}
    </svg>
  )
}

function DiffCard({ label, solved, total, color }) {
  return (
    <div className="lc-diff-card">
      <span className="lc-diff-label" style={{ color }}>{label}</span>
      <span className="lc-diff-count">
        {solved}<span className="lc-diff-total">/{total}</span>
      </span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="lc-widget">
      <div className="lc-sk lc-sk-h" />
      <div className="lc-sk lc-sk-main" />
      <div className="lc-sk lc-sk-stats" />
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

  if (loading || (!data && !error)) return <Skeleton />

  if (error || !data) {
    return (
      <div className="lc-widget lc-state">
        <span className="lc-state-text">Could not load LeetCode data</span>
      </div>
    )
  }

  const totalSolved    = data.totalSolved    ?? data.solvedProblem ?? 0
  const totalQuestions = data.totalQuestions ?? 0
  const easySolved     = data.easySolved     ?? 0
  const totalEasy      = data.totalEasy      ?? 0
  const medSolved      = data.mediumSolved   ?? 0
  const totalMed       = data.totalMedium    ?? 0
  const hardSolved     = data.hardSolved     ?? 0
  const totalHard      = data.totalHard      ?? data.hardTotal ?? 0
  const globalRank     = data.ranking        ? `#${Number(data.ranking).toLocaleString()}` : '—'
  const contestRating  = data.contest?.contestRating        ? Math.round(data.contest.contestRating)                                  : null
  const contestRank    = data.contest?.contestGlobalRanking ? `#${Number(data.contest.contestGlobalRanking).toLocaleString()}` : null

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
        <span className="lc-global-rank">{globalRank}</span>
      </div>

      <div className="lc-main">
        <div className="lc-ring-wrap">
          <DonutChart easy={easySolved} medium={medSolved} hard={hardSolved} />
          <div className="lc-ring-center">
            <div className="lc-ring-num-row">
              <span className="lc-ring-big">{totalSolved}</span>
              {totalQuestions > 0 && <span className="lc-ring-of">/{totalQuestions}</span>}
            </div>
            <span className="lc-ring-label">Solved</span>
          </div>
        </div>

        <div className="lc-diff-cards">
          <DiffCard label="Easy" solved={easySolved} total={totalEasy} color="#00b8a3" />
          <DiffCard label="Med." solved={medSolved}  total={totalMed}  color="#ffa116" />
          <DiffCard label="Hard" solved={hardSolved} total={totalHard} color="#ef4444" />
        </div>
      </div>

      <div className="lc-stats-row">
        {contestRating && (
          <div className="lc-stat">
            <span className="lc-stat-label">Contest Rating</span>
            <span className="lc-stat-val">{contestRating}</span>
          </div>
        )}
        {contestRank && (
          <div className="lc-stat">
            <span className="lc-stat-label">Contest Rank</span>
            <span className="lc-stat-val">{contestRank}</span>
          </div>
        )}
        <div className="lc-stat">
          <span className="lc-stat-label">Global Rank</span>
          <span className="lc-stat-val">{globalRank}</span>
        </div>
      </div>

      {data.badges?.length > 0 && (
        <div className="lc-badges">
          {data.badges.slice(0, 7).map((b, i) => (
            <img key={i} className="lc-badge" src={b.icon} alt={b.displayName} title={b.displayName} />
          ))}
        </div>
      )}
    </a>
  )
}
