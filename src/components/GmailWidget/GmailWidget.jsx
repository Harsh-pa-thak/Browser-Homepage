import './GmailWidget.css'

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MOCK_EMAILS = [
  { id: 1, sender: 'Linear', subject: 'Product Update: Cycles & Insights', time: '10:42 AM', unread: true },
  { id: 2, sender: 'Vercel', subject: 'Deployment failed for production', time: '09:15 AM', unread: true },
  { id: 3, sender: 'GitHub', subject: '[harsh-pathak/browser] Pull request #4', time: 'Yesterday', unread: false },
  { id: 4, sender: 'Figma', subject: 'Someone commented on "Dashboard UI"', time: 'Yesterday', unread: false },
  { id: 5, sender: 'Google', subject: 'Security alert for your linked account', time: 'Nov 12', unread: false },
  { id: 6, sender: 'Spotify', subject: 'Your week in music is here', time: 'Nov 11', unread: false },
]

export default function GmailWidget() {
  return (
    <div className="gmail-widget">
      <div className="gmail-header">
        <div className="gmail-brand">
          <div className="gmail-icon-wrap">
            <GmailIcon />
          </div>
          <span className="gmail-title">Inbox</span>
        </div>
        <div className="gmail-badge">2 New</div>
      </div>

      <div className="gmail-list">
        {MOCK_EMAILS.map(email => (
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
        ))}
      </div>
    </div>
  )
}
