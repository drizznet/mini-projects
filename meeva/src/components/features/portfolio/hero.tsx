import {
  ArrowUpRight,
  Browser,
  Code,
  Cube,
  Database,
  Lightning,
  Terminal,
} from '@phosphor-icons/react'
import { portfolio } from '@/config/portfolio'

const toolIcon = {
  code: Code,
  browser: Browser,
  terminal: Terminal,
  database: Database,
  cube: Cube,
  lightning: Lightning,
}

export function PortfolioHero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-8 lg:py-16"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-surface">
        <img
          src="/assets/portfolio/hero.jpg"
          alt=""
          className="h-56 w-full object-cover sm:h-72 lg:h-[20rem]"
        />
      </div>

      <div className="flex flex-col justify-center">
        {portfolio.openToWork ? (
          <p className="text-xs font-semibold tracking-[0.22em] text-dz-green uppercase">
            Open to work
          </p>
        ) : null}
        <h1 className="mt-3 text-4xl font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
          {portfolio.headline}{' '}
          <span className="text-dz-green">{portfolio.nameAccent}</span>
        </h1>
        <p className="mt-4 text-sm text-muted sm:text-base">
          {portfolio.roles.join('  |  ')}
        </p>
        <div className="mt-5 max-w-xl space-y-3 text-sm leading-7 text-white/80 sm:text-[0.95rem]">
          {portfolio.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Toolbox">
          {portfolio.tools.map((tool) => {
            const Icon = toolIcon[tool.id]
            return (
              <li
                key={tool.id}
                title={tool.label}
                className="grid size-12 place-items-center rounded-xl border border-white/15 text-white"
              >
                <Icon className="size-5" />
                <span className="sr-only">{tool.label}</span>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={portfolio.resumeHref}
            className="inline-flex items-center gap-2 rounded-lg bg-dz-green px-5 py-3 text-sm font-bold tracking-wide text-black uppercase"
          >
            [ View work ]
            <ArrowUpRight className="size-4" />
          </a>
          <a
            href={`mailto:${portfolio.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-dz-blue px-5 py-3 text-sm font-bold tracking-wide text-white uppercase"
          >
            [ Hire me ]
          </a>
        </div>
      </div>
    </section>
  )
}
