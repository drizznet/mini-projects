import { PageEnter } from '@/components/motion/page-enter'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh bg-canvas text-ink">
      <SiteHeader />
      <main>
        <PageEnter>{children}</PageEnter>
      </main>
      <SiteFooter />
    </div>
  )
}
