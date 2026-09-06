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
    <>
      <PortfolioHero />
      <Competencies />
      <Experience />
      <SkillCards />
      <Pipeline />
      <Work />
      <Contact />
      <footer className="border-t border-white/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-faint sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {portfolio.domain}
          </p>
          <Link to="/meeva" className="hover:text-white">
            Meeva — software company
          </Link>
        </div>
      </footer>
    </>
  )
}
