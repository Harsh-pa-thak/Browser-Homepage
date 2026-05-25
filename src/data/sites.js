export const SITES = [
  // --- Large API-powered tiles (handled individually in BentoGrid) ---
  { id: 'github',      name: 'GitHub',        url: 'https://github.com',           type: 'widget' },
  { id: 'leetcode',    name: 'LeetCode',      url: 'https://leetcode.com',         type: 'widget' },
  { id: 'gmail',       name: 'Gmail',         url: 'https://mail.google.com',      type: 'widget' },
  { id: 'youtube',     name: 'YouTube',       url: 'https://youtube.com',          type: 'widget' },
  { id: 'ytmusic',     name: 'YouTube Music', url: 'https://music.youtube.com',    type: 'widget' },

  // --- Simple flip-card tiles ---
  { id: 'neetcode',    name: 'NeetCode',      url: 'https://neetcode.io' },
  { id: 'linkedin',    name: 'LinkedIn',      url: 'https://linkedin.com' },
  { id: 'unstop',      name: 'Unstop',        url: 'https://unstop.com' },
  { id: 'internshala', name: 'Internshala',   url: 'https://internshala.com' },
  { id: 'vtop',        name: 'VTOP',          url: 'https://vtop.vit.ac.in' },
  { id: 'lms',         name: 'LMS',           url: 'https://lms.vit.ac.in' },
  { id: 'netlify',     name: 'Netlify',       url: 'https://netlify.com' },
  { id: 'render',      name: 'Render',        url: 'https://render.com' },
  { id: 'movies',      name: '123Movies',     url: 'https://123movies9.mom' },
  { id: 'instagram',   name: 'Instagram',     url: 'https://instagram.com' },
  { id: 'desktop',     name: 'Desktop',       url: '', isDesktop: true },
]

export const SIMPLE_SITES = SITES.filter(s => s.type !== 'widget')

export function faviconUrl(siteUrl) {
  try {
    const domain = new URL(siteUrl).hostname
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
  } catch (_) {
    return ''
  }
}
