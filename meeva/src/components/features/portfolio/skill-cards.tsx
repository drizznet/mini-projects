import { useEffect, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { portfolio, type SkillAccent } from '@/config/portfolio'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const skins: Record<SkillAccent, string> = {
  orange: 'dz-skin-orange',
  teal: 'dz-skin-teal',
  blue: 'dz-skin-blue',
  green: 'dz-skin-green',
  purple: 'dz-skin-purple',
}

export function SkillCards() {
  const skills = portfolio.skills
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)
  const n = skills.length

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  const go = (dir: -1 | 1) => setIndex((current) => (current + dir + n) % n)
  const prev = (index - 1 + n) % n
  const next = (index + 1) % n
  const shown = reduced ? [index] : [prev, index, next]

  return (
    <section id="skills" className="px-5 py-16 lg:px-8 lg:py-24">
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.28em] text-muted uppercase">
        <span className="size-1.5 rounded-full bg-dz-blue" />
        <span className="size-1.5 rounded-full bg-dz-green" />
        <span className="size-1.5 rounded-full bg-dz-purple" />
        Premium
      </p>
      <h2 className="mt-4 text-center text-4xl font-bold tracking-tight uppercase sm:text-5xl">
        Technology <span className="text-dz-green">Skill Cards</span>
      </h2>
      <p className="mt-3 text-center text-sm text-muted">
        Use the arrows. Hover a card to tilt it.
      </p>

      <div className="relative mx-auto mt-12 max-w-4xl">
        <button
          type="button"
          aria-label="Previous skill"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-0 z-20 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-canvas text-white"
        >
          <CaretLeft className="size-5" />
        </button>

        <div className="dz-skill-stage flex min-h-[22rem] items-center justify-center px-8">
          {shown.map((i) => {
            const skill = skills[i]
            const isCenter = i === index

            return (
              <motion.article
                key={skill.id}
                layout
                className={cn(
                  'dz-skill-card h-[19.5rem] w-[min(18.5rem,78vw)] shrink-0 p-5 text-white',
                  skins[skill.accent],
                  isCenter ? 'dz-skill-glow z-10' : 'hidden sm:block opacity-50'
                )}
                animate={{
                  scale: isCenter ? 1 : 0.82,
                  rotateY: isCenter ? 0 : i === prev ? 16 : -16,
                }}
                whileHover={
                  isCenter && !reduced
                    ? { rotateX: -6, rotateY: 8, scale: 1.03 }
                    : undefined
                }
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] text-white/60 uppercase">
                      {skill.category}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">{skill.name}</h3>
                  </div>
                  <span className="grid size-8 place-items-center rounded-md bg-black/35 text-[10px] font-bold">
                    {skill.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="mt-8 flex items-end justify-between text-xs">
                  <p>
                    <span className="block text-white/50">Level</span>
                    <span className="mt-1 inline-block rounded-full bg-black/40 px-2 py-0.5 font-semibold">
                      {skill.level}
                    </span>
                  </p>
                  <p className="text-right">
                    <span className="block text-white/50">Use</span>
                    <span className="font-semibold text-dz-green">{skill.years}</span>
                  </p>
                </div>
                <div className="my-6 border-t border-dashed border-white/25" />
                <div className="flex items-end justify-between text-[11px] tracking-wide uppercase">
                  <p>
                    <span className="block text-white/45">Holder</span>
                    {skill.holder}
                  </p>
                  <p className="text-right">
                    <span className="block text-white/45">Category</span>
                    {skill.category}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </div>

        <button
          type="button"
          aria-label="Next skill"
          onClick={() => go(1)}
          className="absolute top-1/2 right-0 z-20 grid size-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-canvas text-white"
        >
          <CaretRight className="size-5" />
        </button>
      </div>
    </section>
  )
}
