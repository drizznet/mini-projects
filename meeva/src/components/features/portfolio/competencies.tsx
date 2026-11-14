import { Code, Cpu, Rows } from '@phosphor-icons/react'
import { portfolio } from '@/config/portfolio'

const serviceIcons = [Code, Cpu, Rows]

export function Competencies() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="dorbesh-panel px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="text-center">
          <p className="text-lg font-medium text-[var(--hq-muted)]">Services</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-[var(--hq-ink)] sm:text-6xl">
            Quality services
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {portfolio.competencies.map((item, index) => {
            const Icon = serviceIcons[index % serviceIcons.length]
            return (
              <article key={item.title} className="dorbesh-service-card">
                <Icon className="size-16 text-[var(--primary-color)]" weight="fill" />
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-[var(--hq-ink)]">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-sm text-base leading-8 text-[var(--hq-muted)]">
                  {item.copy}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
