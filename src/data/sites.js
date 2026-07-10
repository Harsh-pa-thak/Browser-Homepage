const BASE_SITES = [
  { id: 'github', name: 'GitHub', url: 'https://github.com', type: 'widget' },
  { id: 'leetcode', name: 'LeetCode', url: 'https://leetcode.com', type: 'widget' },
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', type: 'widget' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', type: 'widget' },
  { id: 'ytmusic', name: 'YouTube Music', url: 'https://music.youtube.com', type: 'widget' },
  { id: 'neetcode', name: 'NeetCode', url: 'https://neetcode.io' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com' },
  { id: 'unstop', name: 'Unstop', url: 'https://unstop.com' },
  { id: 'internshala', name: 'Internshala', url: 'https://internshala.com' },
  { id: 'vtop', name: 'VTOP', url: 'https://vtopcc.vit.ac.in/vtop/open/page', logo: '/logos/vit.png' },
  { id: 'lms', name: 'LMS', url: 'https://lms.vit.ac.in', logo: '/logos/lms.png' },
  { id: 'netlify', name: 'Netlify', url: 'https://netlify.com' },
  { id: 'render', name: 'Render', url: 'https://render.com' },
  { id: 'movies', name: '123Movies', url: 'https://123movies9.mom', logo: 'https://www.google.com/s2/favicons?sz=64&domain=netflix.com' },
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com' },
  { id: 'desktop', name: 'Desktop', url: '', isDesktop: true },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://web.whatsapp.com/', logo: 'https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', logo: 'https://www.google.com/s2/favicons?sz=64&domain=claude.ai' },
  { id: 'gpt', name: 'CharGpt', url: 'https://chatgpt.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com' }
]

const userSitesOverrides = JSON.parse(localStorage.getItem('CUSTOM_SITES') || '{}')

export const SITES = BASE_SITES.map(site => {
  const override = userSitesOverrides[site.id]
  if (override) {
    const newSite = { ...site, ...override }
    // If the URL is changed by the user, the original hardcoded logo is no longer valid.
    // We clear it so that FlipCard falls back to fetching the Google Favicon for the new URL.
    // BUT if the user has also provided a customIcon, we keep that — it takes top priority.
    if (override.url && override.url !== site.url && !override.customIcon) {
      newSite.logo = ''
    }
    return newSite
  }
  return site
})

export const SIMPLE_SITES = SITES.filter(s => s.type !== 'widget')

export function faviconUrl(siteUrl) {
  try {
    const domain = new URL(siteUrl).hostname
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`
  } catch (_) {
    return ''
  }
}
