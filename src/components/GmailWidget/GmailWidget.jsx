import { useState, useEffect, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './GmailWidget.css'

// Matches Gmail's actual avatar color palette
const AVATAR_COLORS = [
  '#d93025', '#e37400', '#188038', '#1967d2',
  '#6f3dc4', '#b5152b', '#0076a8', '#c75000',
]

function senderColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function SenderAvatar({ name }) {
  const initial = (name || '?').charAt(0).toUpperCase()
  return (
    <div className="gmail-avatar" style={{ background: senderColor(name || '') }}>
      {initial}
    </div>
  )
}

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

function parseEmail(message) {
  const headers = message.payload.headers
  const subject = getHeader(headers, 'Subject') || '(no subject)'
  let rawFrom = getHeader(headers, 'From')

  let sender = rawFrom
  if (rawFrom.includes('<')) {
    sender = rawFrom.split('<')[0].replace(/"/g, '').trim()
  } else if (rawFrom.includes('@')) {
    sender = rawFrom.split('@')[0]
  }

  const dateObj = new Date(getHeader(headers, 'Date'))
  const now = new Date()
  let time = ''
  if (dateObj.toDateString() === now.toDateString()) {
    time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (now - dateObj < 86400000 * 7) {
    time = dateObj.toLocaleDateString([], { weekday: 'short' })
  } else {
    time = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return {
    id: message.id,
    sender,
    subject,
    time,
    unread: message.labelIds?.includes('UNREAD'),
    url: `https://mail.google.com/mail/u/0/#inbox/${message.id}`,
  }
}

function SkeletonRows() {
  return [...Array(6)].map((_, i) => (
    <div key={i} className="gmail-item-sk">
      <div className="gmail-sk gmail-sk-avatar" />
      <div className="gmail-sk-body">
        <div className="gmail-sk gmail-sk-line" />
        <div className="gmail-sk gmail-sk-line gmail-sk-line-sm" />
      </div>
    </div>
  ))
}

export default function GmailWidget() {
  const [emails, setEmails] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('gmail_token'))

  const fetchAll = useCallback(async (accessToken) => {
    setLoading(true)
    setError(null)
    try {
      const [userRes, listRes, labelRes] = await Promise.all([
        fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=15', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels/INBOX', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ])

      if (!listRes.ok) {
        const errBody = await listRes.json().catch(() => ({}))
        const reason = errBody?.error?.message || `HTTP ${listRes.status}`
        if (listRes.status === 401 || listRes.status === 403) {
          localStorage.removeItem('gmail_token')
          setToken(null)
        }
        throw new Error(reason)
      }

      const [userJson, listData, labelData] = await Promise.all([
        userRes.json(), listRes.json(), labelRes.json()
      ])
      setUserInfo(userJson)
      setUnreadTotal(labelData.messagesUnread > 99 ? 99 : labelData.messagesUnread)

      const msgs = await Promise.all(
        (listData.messages || []).map(m =>
          fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ).then(r => r.json())
        )
      )
      setEmails(msgs.map(parseEmail))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) fetchAll(token)
  }, [token, fetchAll])

  const login = useGoogleLogin({
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    onSuccess: (res) => {
      localStorage.setItem('gmail_token', res.access_token)
      setToken(res.access_token)
    },
    onError: () => setError('Login failed'),
  })

  const unreadCount = emails.filter(e => e.unread).length

  return (
    <div className="gmail-widget">

      <div className="gmail-header">
        <div className="gmail-brand" onClick={() => window.open('https://mail.google.com', '_blank')}>
          <svg className="gmail-logo-svg" viewBox="0 0 48 48" width="28" height="28">
            <path fill="#EA4335" d="M6 40h6V20.6L2 15v21a3 3 0 003 3z" />
            <path fill="#34A853" d="M36 40h6a3 3 0 003-3V15l-9 5.6z" />
            <path fill="#4285F4" d="M36 8l-12 7.6L12 8H6l18 11.4L42 8z" />
            <path fill="#FBBC04" d="M2 15l10 5.6V8z" />
            <path fill="#EA4335" d="M42 8l-6 12.6L46 15z" />
            <path fill="#C5221F" d="M12 20.6L6 15l6-7.1z" />
          </svg>
          <div className="gmail-header-text">
            <span className="gmail-title">Gmail</span>
            {userInfo && <span className="gmail-email">{userInfo.email}</span>}
          </div>
        </div>
        <button className="compose-btn" onClick={() => window.open('https://mail.google.com/mail/u/0/#compose?compose=new', '_blank')}>Compose</button>
        <div className="gmail-header-right" onClick={() => window.open('https://mail.google.com', '_blank')}>
          {unreadTotal > 0 && (
            <span className="gmail-unread-count">+{unreadTotal}</span>
          )}
          {userInfo?.picture ? (
            <img src={userInfo.picture} className="gmail-profile-pic" alt="Profile" />
          ) : token && (
            <div className="gmail-profile-sk" />
          )}
        </div>
      </div>

      <div className="gmail-list">
        {!token ? (
          <div className="gmail-state" onClick={() => login()}>
            <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: 8 }}>
              <path fill="#EA4335" d="M6 40h6V20.6L2 15v21a3 3 0 003 3z" />
              <path fill="#34A853" d="M36 40h6a3 3 0 003-3V15l-9 5.6z" />
              <path fill="#4285F4" d="M36 8l-12 7.6L12 8H6l18 11.4L42 8z" />
              <path fill="#FBBC04" d="M2 15l10 5.6V8z" />
              <path fill="#EA4335" d="M42 8l-6 12.6L46 15z" />
            </svg>
            <span className="gmail-state-text">Connect Gmail</span>
          </div>
        ) : loading ? (
          <SkeletonRows />
        ) : error ? (
          <div className="gmail-state" onClick={() => login()}>
            <span className="gmail-state-text" style={{ fontSize: 11, textAlign: 'center' }}>
              ⚠ {error}<br /><span style={{ opacity: 0.5 }}>Tap to reconnect</span>
            </span>
          </div>
        ) : emails.length === 0 ? (
          <div className="gmail-state-center">
            <span className="gmail-state-text">Inbox Zero</span>
          </div>
        ) : (
          emails.map(email => (
            <div
              key={email.id}
              className={`gmail-item ${email.unread ? 'unread' : ''}`}
              onClick={() => window.open(email.url, '_blank')}
            >
              <SenderAvatar name={email.sender} />
              <div className="gmail-item-body">
                <div className="gmail-item-row1">
                  <span className="gmail-sender">{email.sender}</span>
                  <span className="gmail-time">{email.time}</span>
                </div>
                <span className="gmail-subject">{email.subject}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
