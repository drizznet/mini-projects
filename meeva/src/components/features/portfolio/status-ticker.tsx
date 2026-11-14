import { portfolio } from '@/config/portfolio'

export function StatusTicker() {
  const row = [...portfolio.ticker, ...portfolio.ticker]

  return (
    <div className="dz-ticker" aria-label="Status">
      <div className="dz-ticker-track py-3 text-xs tracking-wider uppercase font-mono">
        {row.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap px-6 text-slate-300"
          >
            <span className="text-slate-500 font-semibold">{item.label}</span>
            <span className="font-semibold text-white">{item.value}</span>
            <span className="font-bold text-[var(--primary-color)]">{item.delta}</span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
          </span>
        ))}
      </div>
    </div>
  )
}
