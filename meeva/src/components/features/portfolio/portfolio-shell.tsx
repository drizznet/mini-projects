import { PageEnter } from '@/components/motion/page-enter'
import { PortfolioNav } from '@/components/features/portfolio/portfolio-nav'
import { ScrollTop } from '@/components/features/portfolio/scroll-top'
import { StatusTicker } from '@/components/features/portfolio/status-ticker'

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh bg-canvas text-ink">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-dz-green focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <PortfolioNav />
      <StatusTicker />
      <main>
        <PageEnter>{children}</PageEnter>
      </main>
      <ScrollTop />
    </div>
  )
}
