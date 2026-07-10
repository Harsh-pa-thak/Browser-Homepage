import { createContext, useContext, useState, useCallback, useEffect } from 'react'



const ChromeIdentityContext = createContext(null)

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ')

export function ChromeIdentityProvider({ children }) {
  const [token, setToken] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: false }, (tkn) => {
      if (chrome.runtime.lastError) {
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
    chrome.identity.removeCachedAuthToken({ token }, () => {
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
        .catch(() => { /* best-effort */ })
      setToken(null)
    })
  }, [token])

  const getToken = useCallback((forceRefresh = false) => {
    return new Promise((resolve, reject) => {
      if (forceRefresh && token) {
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
