

import FlipCard from '@/components/FlipCard/FlipCard'
import LeetCodeWidget from '@/components/LeetCodeWidget/LeetCodeWidget'
import GitHubWidget from '@/components/GitHubWidget/GitHubWidget'
import GmailWidget from './components/GmailWidget.ext'
import { SIMPLE_SITES } from '@/data/sites'
import '@/components/BentoGrid/BentoGrid.css'

const SITE = {}
SIMPLE_SITES.forEach(s => { SITE[s.id] = s })

export default function BentoGrid() {
  return (
    <div className="bento-grid">

      <div className="bento-cell bento-github">
        <GitHubWidget />
      </div>

      <div className="bento-cell bento-leetcode">
        <LeetCodeWidget />
      </div>

      <div className="bento-cell bento-gmail">
        <GmailWidget />
      </div>

      <div className="bento-cell bento-neetcode">
        <FlipCard site={SITE.neetcode} initialDelay={400} />
      </div>
      <div className="bento-cell bento-unstop">
        <FlipCard site={SITE.unstop} initialDelay={1800} />
      </div>
      <div className="bento-cell bento-linkedin">
        <FlipCard site={SITE.linkedin} initialDelay={900} />
      </div>
      <div className="bento-cell bento-internshala">
        <FlipCard site={SITE.internshala} initialDelay={2600} />
      </div>

      <div className="bento-cell bento-vtop">
        <FlipCard site={SITE.vtop} initialDelay={1200} />
      </div>
      <div className="bento-cell bento-lms">
        <FlipCard site={SITE.lms} initialDelay={3100} />
      </div>
      <div className="bento-cell bento-netlify">
        <FlipCard site={SITE.netlify} initialDelay={2000} />
      </div>
      <div className="bento-cell bento-render">
        <FlipCard site={SITE.render} initialDelay={3700} />
      </div>
      <div className="bento-cell bento-movies">
        <FlipCard site={SITE.movies} initialDelay={500} />
      </div>
      <div className="bento-cell bento-instagram">
        <FlipCard site={SITE.instagram} initialDelay={2300} />
      </div>
      <div className="bento-cell bento-desktop">
        <FlipCard site={SITE.desktop} initialDelay={4200} />
      </div>
      <div className="bento-cell bento-whatsapp">
        <FlipCard site={SITE.whatsapp} initialDelay={4200} />
      </div>
      <div className="bento-cell bento-claude">
        <FlipCard site={SITE.claude} initialDelay={4200} />
      </div>
      <div className="bento-cell bento-gpt">
        <FlipCard site={SITE.gpt} initialDelay={4200} />
      </div>

    </div>
  )
}
