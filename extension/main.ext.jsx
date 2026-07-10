import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChromeIdentityProvider } from './auth/ChromeIdentityProvider'
import '@/index.css'
import App from './App.ext'   // ← extension App (no @react-oauth/google anywhere in chain)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChromeIdentityProvider>
      <App />
    </ChromeIdentityProvider>
  </StrictMode>,
)
