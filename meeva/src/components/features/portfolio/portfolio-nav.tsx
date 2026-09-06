import { useEffect, useRef, useState } from 'react'
import { GithubLogo, List, X } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { DrizzMark } from '@/components/features/portfolio/drizz-mark'
import { portfolio } from '@/config/portfolio'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const links = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

function navFloat(scrollY: number) {
  const t = Math.min(1, Math.max(0, scrollY / 160))
  if (prefersReducedMotion()) return t > 0.35 ? 1 : 0
  return t * t * (3 - 2 * t)
}

export function PortfolioNav() {
  const barRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const ids = links.map((link) => link.id)
    let frame = 0

    const apply = () => {
      frame = 0
      barRef.current?.style.setProperty('--dz-nav-float', String(navFloat(window.scrollY)))

      const mark = 140
      let current = 'top'
      for (const id of ids) {
        const node = document.getElementById(id)
        if (!node) continue
        if (node.getBoundingClientRect().top <= mark) current = id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header ref={barRef} className="dz-nav-bar">
      <div className="dz-nav flex items-center justify-between px-4 py-2.5 sm:px-6">
        <nav className="hidden items-center gap-5 text-sm text-white md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              data-active={active === link.id}
              className="dz-nav-link px-0.5 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="md:absolute md:left-1/2 md:-translate-x-1/2" aria-label={portfolio.domain}>
          <DrizzMark />
        </a>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {portfolio.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-9 place-items-center rounded-full text-white/80 hover:text-white"
              >
                {social.id === 'github' ? <GithubLogo className="size-5" /> : null}
              </a>
            ))}
            <Link
              to="/meeva"
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white"
            >
              Meeva
            </Link>
          </div>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-white/15 text-white md:hidden"
            onClick={() => setOpen(true)}
          >
            <List className="size-5" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            className="absolute inset-x-3 top-3 rounded-3xl border border-white/10 bg-[#111] p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <DrizzMark compact />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full border border-white/15"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-6 grid gap-1">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-3 text-lg',
                    active === link.id ? 'text-dz-green' : 'text-white'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/meeva"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-lg text-white/70"
              >
                Meeva
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  )
}
