import { createContext, useContext, useState, useCallback, useEffect } from 'react'

/**
 * ChromeIdentityContext
 *
 * Drop-in replacement for @react-oauth/google in the extension build.
 * Uses chrome.identity API — Chrome handles token caching and refresh
 * automatically. Tokens never leave your local machine.
 *
 * Provides:
 *   - login()   → triggers interactive OAuth flow
 *   - logout()  → clears cached token
 *   - token     → current access token (or null)
 *   - isReady   → true once the silent token check has completed
 */

const ChromeIdentityContext = createContext(null)

// Gmail + profile scopes — same as the web build
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ')

export function ChromeIdentityProvider({ children }) {
  const [token, setToken] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // On mount: try to get a token silently (non-interactive).
  // Chrome will succeed if the user already signed in before.
  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: false }, (tkn) => {
      if (chrome.runtime.lastError) {
        // Not signed in yet — that's fine, just mark as ready
        console.log('[ChromeIdentity] No cached token:', chrome.runtime.lastError.message)
      } else if (tkn) {
        setToken(tkn)
      }
      setIsReady(true)
    })
  }, [])

  const login = useCallback(() => {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (tkn) => {
        if (chrome.runtime.lastError) {
          console.error('[ChromeIdentity] Login failed:', chrome.runtime.lastError)
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        setToken(tkn)
        resolve(tkn)
      })
    })
  }, [])

  const logout = useCallback(() => {
    if (!token) return
    // Remove from Chrome's cache so next login() prompts the user again
    chrome.identity.removeCachedAuthToken({ token }, () => {
      // Also revoke on Google's side so the token is truly dead
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
        .catch(() => { /* best-effort */ })
      setToken(null)
    })
  }, [token])

  /**
   * getToken() — use this when making API calls.
   * If the current token is expired, Chrome silently refreshes it.
   * Pass forceRefresh=true to explicitly get a new one.
   */
  const getToken = useCallback((forceRefresh = false) => {
    return new Promise((resolve, reject) => {
      if (forceRefresh && token) {
        // Remove stale token first so Chrome fetches a fresh one
        chrome.identity.removeCachedAuthToken({ token }, () => {
          chrome.identity.getAuthToken({ interactive: false }, (tkn) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message))
              return
            }
            setToken(tkn)
            resolve(tkn)
          })
        })
      } else {
        chrome.identity.getAuthToken({ interactive: false }, (tkn) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message))
            return
          }
          if (tkn !== token) setToken(tkn)
          resolve(tkn)
        })
      }
    })
  }, [token])

  return (
    <ChromeIdentityContext.Provider value={{ token, isReady, login, logout, getToken }}>
      {children}
    </ChromeIdentityContext.Provider>
  )
}

export function useChromeIdentity() {
  const ctx = useContext(ChromeIdentityContext)
  if (!ctx) throw new Error('useChromeIdentity must be used within ChromeIdentityProvider')
  return ctx
}
