// ============================================================
// HOMEPAGE CONFIGURATION
// Keys are stored in localStorage.
// Use the Settings panel (gear icon) to update via UI — no code changes needed.
// ============================================================

export const DEFAULT_CONFIG = {
  github:   { username: '' },
  leetcode: { username: '' },
  google: {
    clientId:      '',  // OAuth 2.0 Client ID → Gmail + YouTube liked videos
    youtubeApiKey: '',  // YouTube Data API v3 key → YTMusic search
  },
  desktop:  { url: 'file:///home/' },
}

const KEY = 'homepage_cfg_v1'

export function getConfig() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const stored = JSON.parse(raw)
      return {
        ...DEFAULT_CONFIG,
        ...stored,
        github:   { ...DEFAULT_CONFIG.github,   ...stored.github },
        leetcode: { ...DEFAULT_CONFIG.leetcode, ...stored.leetcode },
        google:   { ...DEFAULT_CONFIG.google,   ...stored.google },
        desktop:  { ...DEFAULT_CONFIG.desktop,  ...stored.desktop },
      }
    }
  } catch (_) {}
  return { ...DEFAULT_CONFIG }
}

export function saveConfig(patch) {
  const current = getConfig()
  const next = {
    ...current,
    ...patch,
    github:   { ...current.github,   ...patch.github },
    leetcode: { ...current.leetcode, ...patch.leetcode },
    google:   { ...current.google,   ...patch.google },
    desktop:  { ...current.desktop,  ...patch.desktop },
  }
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
