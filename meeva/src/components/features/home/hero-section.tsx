import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CrosshairCursor from '@/components/cursor'
import { ScreenMarquee } from '@/components/motion/screen-marquee'
import { siteConfig } from '@/config/site'
import { prefersReducedMotion } from '@/lib/motion'
import { getMarqueeScreens } from '@/lib/products'

gsap.registerPlugin(useGSAP)

function splitWords(text: string) {
  return text.split(' ').map((word, index) => (
    <span key={`${word}-${index}`} className="hq-word">
      <span className="hq-word-inner">{word}&nbsp;</span>
    </span>
  ))
}

export function HeroSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return
      const words = root.current.querySelectorAll('.hq-word-inner')
      gsap.fromTo(
        words,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.06,
          ease: 'power4.out',
          delay: 0.08,
        }
      )
      gsap.fromTo(
        root.current.querySelectorAll('[data-hero-copy]'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.4, ease: 'power3.out' }
      )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      id="top"
      className="hq-hero-cursor relative overflow-hidden"
      aria-labelledby="hq-heading"
    >
      <CrosshairCursor
        verticalColor="color-mix(in srgb, var(--hq-ink) 55%, transparent)"
        horizontalColor="color-mix(in srgb, var(--hq-ink) 55%, transparent)"
        dotColor="var(--hq-ink)"
        labelColor="var(--hq-accent-ink)"
        labelBg="var(--hq-ink)"
        labelFont={{
          fontFamily: 'var(--hq-font-body)',
          fontWeight: 500,
          fontSize: 11,
          lineHeight: '1.4em',
          letterSpacing: '0.02em',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-5 pt-16 text-center sm:pt-24 lg:pt-28">
        <h1
          id="hq-heading"
          className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          {splitWords(siteConfig.tagline)}
        </h1>
        <p
          data-hero-copy
          className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg"
        >
          {siteConfig.description}
        </p>
      </div>

      <div className="relative mt-10 sm:mt-14">
        <ScreenMarquee items={getMarqueeScreens()} />
      </div>

      <div className="relative mx-auto max-w-lg px-5 pb-20 text-center sm:pb-24">
        <p data-hero-copy className="text-sm leading-7 text-muted sm:text-base">
          {siteConfig.manifesto}
        </p>
        <div
          data-hero-copy
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium"
        >
          <Link to="/marketplace" className="underline underline-offset-4">
            Marketplace
          </Link>
          <Link to="/soon" className="underline underline-offset-4">
            Coming soon
          </Link>
        </div>
      </div>
    </section>
  )
}
