export const env = {
  github: { username: localStorage.getItem('CUSTOM_GITHUB_ID') || import.meta.env.VITE_GITHUB_USERNAME || '' },
  leetcode: { username: localStorage.getItem('CUSTOM_LEETCODE_ID') || import.meta.env.VITE_LEETCODE_USERNAME || '' },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  },
  desktop: { url: import.meta.env.VITE_DESKTOP_URL || 'file:///home/' },
}
