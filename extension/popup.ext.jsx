import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChromeIdentityProvider } from './auth/ChromeIdentityProvider'
import '@/index.css'
import Popup from './popup/Popup'

createRoot(document.getElementById('popup-root')).render(
  <StrictMode>
    <ChromeIdentityProvider>
      <Popup />
    </ChromeIdentityProvider>
  </StrictMode>,
)
