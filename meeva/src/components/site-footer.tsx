import { Link } from '@tanstack/react-router'
import { BrandMark } from '@/components/brand-mark'
import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <BrandMark compact />
        <nav className="flex gap-5 text-sm text-muted">
          {siteConfig.nav.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-faint">
          © {new Date().getFullYear()} {siteConfig.legalName}
        </p>
      </div>
    </footer>
  )
}
