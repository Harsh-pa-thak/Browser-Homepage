import { useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './GmailWidget.css'

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function getHeader(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase())
  return header ? header.value : ''
}

function parseEmail(message) {
  const headers = message.payload.headers
  const subject = getHeader(headers, 'Subject')
  let sender = getHeader(headers, 'From')
  
  if (sender.includes('<')) {
    sender = sender.split('<')[0].replace(/"/g, '').trim()
  }
  
  const dateStr = getHeader(headers, 'Date')
  const dateObj = new Date(dateStr)
  
  const now = new Date()
  let time = ''
  if (dateObj.toDateString() === now.toDateString()) {
    time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (now - dateObj < 86400000 * 2) {
    time = 'Yesterday'
  } else {
    time = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const unread = message.labelIds?.includes('UNREAD')

  return {
    id: message.id,
    sender,
    subject,
    time,
    unread,
  }
}

export default function GmailWidget() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('gmail_token'))

  const fetchEmails = async (accessToken) => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch message IDs
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=6', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (!listRes.ok) {
        const errBody = await listRes.json().catch(() => ({}))
        const reason = errBody?.error?.message || errBody?.error?.status || `HTTP ${listRes.status}`
        console.error('Gmail API error:', errBody)
        
        if (listRes.status === 401 || listRes.status === 403) {
          localStorage.removeItem('gmail_token')
          setToken(null)
          throw new Error(reason)
        }
        throw new Error(reason)
      }
      
      const listData = await listRes.json()
      const messageIds = listData.messages || []

      // 2. Fetch full message details (metadata only for speed)
      const detailPromises = messageIds.map(msg => 
        fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(res => res.json())
      )

      const messages = await Promise.all(detailPromises)
      const parsedEmails = messages.map(parseEmail)
      setEmails(parsedEmails)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchEmails(token)
    }
  }, [token])

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    onSuccess: (tokenResponse) => {
      const accessToken = tokenResponse.access_token
      localStorage.setItem('gmail_token', accessToken)
      setToken(accessToken)
    },
    onError: (err) => {
      console.error('Login Failed', err)
      setError('Login failed')
    }
  })

  const unreadCount = emails.filter(e => e.unread).length

  return (
    <div className="gmail-widget">
      <div className="gmail-header">
        <div className="gmail-brand">
          <div className="gmail-icon-wrap">
            <GmailIcon />
          </div>
          <span className="gmail-title">Inbox</span>
        </div>
        {unreadCount > 0 && <div className="gmail-badge">{unreadCount} New</div>}
      </div>

      <div className="gmail-list">
        {!token ? (
          <div className="gmail-state" onClick={() => login()}>
            <span className="gmail-state-text">Connect Gmail</span>
          </div>
        ) : loading ? (
          <div className="gmail-state-transparent">
            <div className="gmail-pulse-dot" />
            <span className="gmail-state-text">Syncing...</span>
          </div>
        ) : error ? (
          <div className="gmail-state" onClick={() => login()}>
            <span className="gmail-state-text" style={{ textAlign: 'center', padding: '0 8px', fontSize: '11px' }}>
              ⚠ {error}<br /><span style={{ opacity: 0.6 }}>Click to reconnect</span>
            </span>
          </div>
        ) : emails.length === 0 ? (
          <div className="gmail-state-transparent">
            <span className="gmail-state-text">Inbox Zero ✨</span>
          </div>
        ) : (
          emails.map(email => (
            <div key={email.id} className={`gmail-item ${email.unread ? 'unread' : ''}`}>
              <div className="gmail-item-left">
                {email.unread && <span className="gmail-dot" />}
                <span 
                  className="gmail-sender" 
                  style={{ marginLeft: email.unread ? 0 : '14px' }}
                >
                  {email.sender}
                </span>
              </div>
              <span className="gmail-subject">{email.subject}</span>
              <span className="gmail-time">{email.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
