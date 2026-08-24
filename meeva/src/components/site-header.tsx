import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { List } from '@phosphor-icons/react'
import { BrandMark } from '@/components/brand-mark'
import { NavSheet } from '@/components/nav-sheet'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link to="/" aria-label={`${siteConfig.name} home`}>
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="underline-offset-4 transition hover:text-ink hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="rounded-md border border-line p-2 text-ink md:hidden"
        >
          <List className="size-5" />
        </button>
      </div>
      <NavSheet open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
