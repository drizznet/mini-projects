export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-line py-3">
      <div className="hq-marquee gap-10 pr-10 text-xs font-medium tracking-[0.28em] text-faint uppercase">
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            {item}
            <span className="text-accent">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
