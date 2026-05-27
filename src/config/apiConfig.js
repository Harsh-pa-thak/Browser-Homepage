export const env = {
  github: { username: import.meta.env.VITE_GITHUB_USERNAME || '' },
  leetcode: { username: import.meta.env.VITE_LEETCODE_USERNAME || '' },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  },
  desktop: { url: import.meta.env.VITE_DESKTOP_URL || 'file:///home/' },
}
