import { portfolio } from '@/config/portfolio'
import { cn } from '@/lib/utils'

const tones = {
  green: 'bg-dz-green text-black',
  purple: 'bg-dz-purple text-black',
  yellow: 'bg-dz-yellow text-black',
}

const panels = {
  green: 'bg-black/25 text-white',
  purple: 'bg-white/55 text-black',
  yellow: 'bg-white/50 text-black',
}

export function Competencies() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Core Competencies
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-muted sm:text-base">
        The work I take: products with a real interface, a real backend, and a
        reason to exist.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {portfolio.competencies.map((item) => (
          <article
            key={item.title}
            className={cn('dz-comp-card flex flex-col p-6', tones[item.tone])}
          >
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag} className="dz-pill">
                  {tag}
                </li>
              ))}
            </ul>
            <p
              className={cn(
                'mt-6 flex-1 rounded-2xl p-4 text-sm leading-6',
                panels[item.tone]
              )}
            >
              {item.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
