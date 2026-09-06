import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { List } from '@phosphor-icons/react'
import { BrandMark } from '@/components/brand-mark'
import { NavSheet } from '@/components/nav-sheet'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-canvas">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to={siteConfig.routes.home} aria-label={`${siteConfig.name} home`}>
          <BrandMark />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/marketplace"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas"
          >
            Marketplace
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            className="rounded-full border border-line p-2.5 text-ink md:hidden"
          >
            <List className="size-5" />
          </button>
        </div>
      </div>
      <NavSheet open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
