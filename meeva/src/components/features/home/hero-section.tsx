import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowRight } from '@phosphor-icons/react'
import { Marquee } from '@/components/motion/marquee'
import { siteConfig } from '@/config/site'
import { easeOut, prefersReducedMotion } from '@/lib/motion'

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
          duration: 1.15,
          stagger: 0.07,
          ease: 'power4.out',
          delay: 0.12,
        }
      )
      gsap.fromTo(
        root.current.querySelectorAll('[data-hero-copy]'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.45, ease: 'power3.out' }
      )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      id="top"
      className="relative overflow-hidden"
      aria-labelledby="hq-heading"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute top-24 right-0 hidden select-none font-display text-[18vw] leading-none text-ink/4 lg:block"
      >
        meeva
      </p>
      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-16 sm:pt-28 lg:px-8 lg:pt-32 lg:pb-20">
        <p data-hero-copy className="text-xs tracking-[0.28em] text-accent uppercase">
          {siteConfig.kind}
        </p>
        <h1
          id="hq-heading"
          className="mt-6 max-w-4xl font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl"
        >
          {splitWords(siteConfig.tagline)}
        </h1>
        <p
          data-hero-copy
          className="mt-10 max-w-xl text-lg leading-8 text-muted"
        >
          {siteConfig.description}
        </p>
        <p data-hero-copy className="mt-4 max-w-xl leading-7 text-faint">
          {siteConfig.manifesto}
        </p>
      </div>

      <Marquee
        items={[
          'Software company',
          'Marketplace',
          'Coming soon',
          'Early access',
          'Built to stay',
        ]}
      />

      <div className="mx-auto grid max-w-6xl md:grid-cols-2">
        {[
          {
            to: '/marketplace' as const,
            kicker: 'Store',
            title: 'Marketplace',
            body: 'Live products. Read what they do, then open them.',
            cta: 'Enter the store',
          },
          {
            to: '/soon' as const,
            kicker: 'Share this page',
            title: 'Coming soon',
            body: 'Upcoming work. Request early access or a note at launch.',
            cta: 'See what’s next',
          },
        ].map((door) => (
          <motion.div
            key={door.to}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <Link
              to={door.to}
              className="group block border-b border-line px-5 py-12 md:border-r md:last:border-r-0 lg:px-8"
            >
              <p className="text-xs tracking-[0.22em] text-faint uppercase">
                {door.kicker}
              </p>
              <h2 className="mt-4 font-display text-4xl italic sm:text-5xl">
                {door.title}
              </h2>
              <p className="mt-4 max-w-sm leading-7 text-muted">{door.body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
                {door.cta}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
