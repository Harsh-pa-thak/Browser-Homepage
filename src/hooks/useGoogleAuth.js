import { useState, useCallback, useRef } from 'react'

export function useGoogleAuth(clientId) {
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const clientRef             = useRef(null)

  const signIn = useCallback(() => {
    if (!clientId) {
      setError('No OAuth Client ID configured.')
      return
    }
    setLoading(true)
    setError(null)

    function initAndRequest() {
      if (!clientRef.current) {
        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/youtube.readonly',
          ].join(' '),
          callback: (res) => {
            setLoading(false)
            if (res.error) { setError(res.error_description || res.error); return }
            setToken(res.access_token)
          },
        })
      }
      clientRef.current.requestAccessToken()
    }

    if (window.google?.accounts?.oauth2) {
      initAndRequest()
    } else {
      const s = document.createElement('script')
      s.src   = 'https://accounts.google.com/gsi/client'
      s.async = true
      s.defer = true
      s.onload  = initAndRequest
      s.onerror = () => { setLoading(false); setError('Failed to load Google sign-in') }
      document.head.appendChild(s)
    }
  }, [clientId])

  const signOut = useCallback(() => {
    if (token) window.google?.accounts?.oauth2?.revoke(token, () => {})
    setToken(null)
    clientRef.current = null
  }, [token])

  return { token, loading, error, signIn, signOut }
}
