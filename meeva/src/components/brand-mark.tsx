import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-left">
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg border border-line bg-surface"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <path
            d="M4 18V6l8 8 8-8v12"
            className="stroke-accent"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>
        <span
          className={cn(
            'block font-semibold tracking-[-0.08em] text-ink',
            compact ? 'text-xl leading-none' : 'text-[1.65rem] leading-[0.8]'
          )}
        >
          {siteConfig.name}
        </span>
        <span className="mt-1 block text-[9px] font-bold tracking-[0.22em] text-faint uppercase">
          {siteConfig.kind}
        </span>
      </span>
    </span>
  )
}
