import { portfolio } from '@/config/portfolio'

export function StatusTicker() {
  const row = [...portfolio.ticker, ...portfolio.ticker]

  return (
    <div className="dz-ticker" aria-label="Status">
      <div className="dz-ticker-track py-2.5 text-xs tracking-wide">
        {row.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className="inline-flex items-center gap-3 px-5 text-white/80"
          >
            <span className="text-white/40">{item.label}</span>
            <span className="font-medium text-white">{item.value}</span>
            <span className="font-medium text-dz-green">{item.delta}</span>
            <span aria-hidden className="h-3 w-px bg-white/20" />
          </span>
        ))}
      </div>
    </div>
  )
}
