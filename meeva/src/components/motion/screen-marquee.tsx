import { useEffect, useRef } from 'react'
import { CoverField } from '@/components/features/shared/cover-field'
import { prefersReducedMotion } from '@/lib/motion'

export type MarqueeScreen = {
  slug: string
  label: string
  src: string
}

export function ScreenMarquee({ items }: { items: MarqueeScreen[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const row = [...items, ...items]

  useEffect(() => {
    if (prefersReducedMotion() || !trackRef.current) return

    let frame = 0
    const tick = () => {
      const mid = window.innerWidth / 2
      const cards = trackRef.current?.children
      if (cards) {
        for (const node of cards) {
          const card = node as HTMLElement
          const rect = card.getBoundingClientRect()
          const dx = (rect.left + rect.width / 2 - mid) / mid
          const clamped = Math.max(-1.2, Math.min(1.2, dx))
          card.style.transform = `rotateZ(${clamped * 7}deg) rotateY(${clamped * -20}deg) translateY(${Math.abs(clamped) * 32}px)`
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="hq-screen-marquee" aria-label="Pages and products">
      <div ref={trackRef} className="hq-screen-track">
        {row.map((item, index) => (
          <figure key={`${item.slug}-${index}`} className="hq-screen-card">
            <CoverField
              src={item.src}
              alt=""
              label={item.label}
              className="h-full w-full"
            />
            <figcaption className="sr-only">{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
