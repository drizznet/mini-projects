import { portfolio } from '@/config/portfolio'
import { cn } from '@/lib/utils'

export function DrizzMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          'grid place-items-center rounded-full bg-white font-bold tracking-tight text-black',
          compact ? 'size-9 text-[10px]' : 'size-11 text-[11px]'
        )}
      >
        {portfolio.mark}
      </span>
      <span className="sr-only">{portfolio.domain}</span>
    </span>
  )
}
