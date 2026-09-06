import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { portfolio } from '@/config/portfolio'

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Work</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
        Selected products and sites. Meeva is live on this domain.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {portfolio.work.map((item) => {
          const body = (
            <>
              <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
                {item.kind}
              </p>
              <h3 className="mt-3 flex items-center gap-2 text-2xl font-semibold">
                {item.name}
                {'href' in item && item.href ? (
                  <ArrowUpRight className="size-5 text-dz-green" />
                ) : null}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.copy}</p>
            </>
          )

          if ('internal' in item && item.internal) {
            return (
              <Link
                key={item.name}
                to="/meeva"
                className="rounded-2xl border border-white/10 bg-surface p-6 transition hover:border-dz-green/40"
              >
                {body}
              </Link>
            )
          }

          return (
            <article
              key={item.name}
              className="rounded-2xl border border-white/10 bg-surface p-6"
            >
              {body}
            </article>
          )
        })}
      </div>
    </section>
  )
}
