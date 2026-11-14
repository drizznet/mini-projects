import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GithubLogo, List, X } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { DrizzMark } from '@/components/features/portfolio/drizz-mark'
import { portfolio } from '@/config/portfolio'
import { cn } from '@/lib/utils'

const links = [
  { id: 'top', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Works' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const

export function PortfolioNav() {
  const barRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const ids = links.map((link) => link.id)
    let frame = 0

    const apply = () => {
      frame = 0
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
    <header ref={barRef} className="dz-nav-bar py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2" aria-label={portfolio.domain}>
          <DrizzMark />
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              data-active={active === link.id}
              className={cn(
                'transition-colors duration-200 hover:text-[var(--primary-color)]',
                active === link.id && 'text-[var(--primary-color)] font-semibold'
              )}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/meeva"
            className="text-slate-400 transition-colors duration-200 hover:text-white"
          >
            Meeva HQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            {portfolio.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
              >
                {social.id === 'github' ? <GithubLogo className="size-4" /> : null}
              </a>
            ))}
            <a
              href="#contact"
              className="dorbesh-btn text-xs py-2 px-4 rounded-xl"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl border border-white/15 text-white md:hidden"
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            className="absolute inset-x-3 top-3 rounded-2xl border border-[var(--hq-line-strong)] bg-[var(--hq-surface)] p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <DrizzMark compact />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-xl border border-white/15 text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-6 grid gap-2">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                    active === link.id
                      ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-semibold'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/meeva"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-base text-slate-400 hover:text-white"
              >
                Meeva HQ
              </Link>
              <div className="mt-4 pt-4 border-t border-white/10">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="dorbesh-btn w-full justify-center py-3 text-sm rounded-xl"
                >
                  <span>Hire Me</span>
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  )
}

