import { useLeetCode } from '../../hooks/useLeetCode'
import { env } from '../../config/apiConfig'
import './LeetCodeWidget.css'

const R = 48, CX = 60, CY = 60
const CIRC = 2 * Math.PI * R
const GAUGE = CIRC * 0.78

function DonutChart({ easy, medium, hard }) {
  const total = easy + medium + hard
  const easyLen = total > 0 ? (easy / total) * GAUGE : 0
  const medLen = total > 0 ? (medium / total) * GAUGE : 0
  const hardLen = total > 0 ? (hard / total) * GAUGE : 0

  const seg = (offset, len, color) => (
    <circle
      cx={CX} cy={CY} r={R}
      fill="none"
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      strokeDasharray={`${len} ${CIRC - len}`}
      strokeDashoffset={CIRC - offset}
      transform={`rotate(-135, ${CX}, ${CY})`}
    />
  )

  return (
    <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', display: 'block' }}>
      <circle
        cx={CX} cy={CY} r={R}
        fill="none"
        stroke="#212121"
        strokeWidth={6}
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

function DiffBar({ label, solved, total, color }) {
  const pct = total > 0 ? Math.min((solved / total) * 100, 100) : 0
  return (
    <div className="lc-bar-row">
      <span className="lc-bar-label" style={{ color }}>{label}</span>
      <div className="lc-bar-track">
        <div className="lc-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="lc-bar-num">{solved}<span className="lc-bar-total">/{total}</span></span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="lc-widget">
      <div className="lc-sk lc-sk-h" />
      <div className="lc-sk lc-sk-main" />
      <div className="lc-sk lc-sk-badges" />
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

  const totalSolved = data.totalSolved ?? data.solvedProblem ?? 0
  const totalQuestions = data.totalQuestions ?? 0
  const easySolved = data.easySolved ?? 0
  const totalEasy = data.totalEasy ?? 0
  const medSolved = data.mediumSolved ?? 0
  const totalMed = data.totalMedium ?? 0
  const hardSolved = data.hardSolved ?? 0
  const totalHard = data.totalHard ?? data.hardTotal ?? 0
  const globalRank = data.ranking ? `#${Number(data.ranking).toLocaleString()}` : '—'
  const contestRating = data.contest?.contestRating ? Math.round(data.contest.contestRating) : null
  const contestRank = data.contest?.contestGlobalRanking ? `#${Number(data.contest.contestGlobalRanking).toLocaleString()}` : null

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
            src="/logos/leetcode.png"
            width="18" height="18" alt="LeetCode"
          />
          <span className="lc-brand-name">LeetCode</span>
          <span className="lc-username">@{username}</span>
        </div>
      </div>

      <div className="lc-body">

        <div className="lc-left">
          <DiffBar label="Easy" solved={easySolved} total={totalEasy} color="#00b8a3" />
          <DiffBar label="Med" solved={medSolved} total={totalMed} color="#ffa116" />
          <DiffBar label="Hard" solved={hardSolved} total={totalHard} color="#ef4444" />
        </div>

        <div className="lc-center">
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
        </div>

        <div className="lc-right">
          {contestRating && (
            <div className="lc-stat">
              <span className="lc-stat-label">Rating</span>
              <span className="lc-stat-val">{contestRating}</span>
            </div>
          )}
          {contestRank && (
            <div className="lc-stat">
              <span className="lc-stat-label">Contest</span>
              <span className="lc-stat-val">{contestRank}</span>
            </div>
          )}
          <div className="lc-stat">
            <span className="lc-stat-label">Global</span>
            <span className="lc-stat-val">{globalRank}</span>
          </div>
        </div>

      </div>

      {data.badges?.length > 0 && (
        <div className="lc-badges">
          {data.badges.map((b, i) => (
            <img key={i} className="lc-badge" src={b.icon} alt={b.displayName} title={b.displayName} />
          ))}
        </div>
      )}
    </a>
  )
}
