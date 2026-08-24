import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@tanstack/react-router'
import { X } from '@phosphor-icons/react'
import { BrandMark } from '@/components/brand-mark'
import { siteConfig } from '@/config/site'

export function NavSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="hq-sheet-overlay absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-sheet-title"
        className="hq-sheet-panel fixed top-0 right-0 flex h-svh w-[min(22rem,92vw)] flex-col border-l border-line bg-raised shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <p id="nav-sheet-title" className="text-xs text-faint">
            Menu
          </p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md border border-line p-2 text-ink"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 pb-8">
          <BrandMark />
        </div>
        <nav className="flex flex-1 flex-col px-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="rounded-md px-3 py-3 text-lg text-ink hover:bg-canvas"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>,
    document.body
  )
}
