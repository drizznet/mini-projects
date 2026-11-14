import { motion, useReducedMotion } from 'framer-motion'
import { portfolio } from '@/config/portfolio'

const colors = [
  'var(--primary-color)',
  '#e8a84e',
  '#8e7bd8',
  '#e27d8a',
  '#5d9ac7',
]

export function SkillCards() {
  const reduced = useReducedMotion()

  return (
    <section id="skills" className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="dorbesh-panel overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-lg font-medium text-[var(--hq-muted)]">Pro skills</p>
            <h2 className="mt-4 max-w-2xl text-5xl font-semibold tracking-[-0.06em] text-[var(--hq-ink)] sm:text-6xl">
              Let’s explore my skills
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-[var(--hq-muted)]">
            A handful of tools I use to turn fuzzy ideas into software people can actually use.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {portfolio.skills.map((skill, index) => {
            const color = colors[index % colors.length]
            return (
              <motion.article
                key={skill.id}
                initial={reduced ? undefined : { opacity: 0, y: 24, rotate: index % 2 ? 2 : -2 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06, type: 'spring', stiffness: 180, damping: 18 }}
                whileHover={reduced ? undefined : { y: -10, rotate: index % 2 ? -2 : 2, scale: 1.02 }}
                className="dorbesh-skill-card group"
                style={{ '--skill-color': color } as { '--skill-color': string }}
              >
                <span className="dorbesh-skill-orbit" aria-hidden />
                <span className="dorbesh-skill-number">0{index + 1}</span>
                <div className="relative z-10 mt-16">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--hq-muted)]">
                    {skill.category}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--hq-ink)]">
                    {skill.name}
                  </h3>
                  <div className="mt-8 flex items-center justify-between border-t border-[var(--hq-line)] pt-4 text-xs">
                    <span className="text-[var(--hq-muted)]">{skill.years}</span>
                    <span className="font-semibold text-[var(--skill-color)]">{skill.level}</span>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
