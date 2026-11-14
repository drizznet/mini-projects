import { Link } from '@tanstack/react-router'
import { Competencies } from '@/components/features/portfolio/competencies'
import { Contact } from '@/components/features/portfolio/contact'
import { Experience } from '@/components/features/portfolio/experience'
import { PortfolioHero } from '@/components/features/portfolio/hero'
import { Pipeline } from '@/components/features/portfolio/pipeline'
import { SkillCards } from '@/components/features/portfolio/skill-cards'
import { Work } from '@/components/features/portfolio/work'
import { portfolio } from '@/config/portfolio'

export function PortfolioPage() {
  return (
    <div className="bg-[var(--hq-canvas)] text-[var(--hq-ink)] font-sans selection:bg-[var(--primary-color)] selection:text-white">
      <PortfolioHero />
      <Competencies />
      <SkillCards />
      <Experience />
      <Work />
      <Pipeline />
      <Contact />

      <footer className="border-t border-white/10 bg-[var(--hq-surface)] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs sm:text-sm text-slate-400 sm:flex-row">
          <p>
            Copyright © {new Date().getFullYear()}, <span className="font-semibold text-white">{portfolio.name}</span> ({portfolio.domain}). All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/meeva" className="transition-colors hover:text-[var(--primary-color)]">
              Meeva Company HQ
            </Link>
            <span>•</span>
            <a href="#top" className="transition-colors hover:text-white">
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

