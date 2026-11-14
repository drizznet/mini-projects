import {
  ArrowUpRight,
  GithubLogo,
  LinkedinLogo,
  TwitterLogo,
} from '@phosphor-icons/react'
import { portfolio } from '@/config/portfolio'
import { StatusTicker } from '@/components/features/portfolio/status-ticker'

const socials = [
  { label: 'GitHub', href: portfolio.socials[0]?.href, Icon: GithubLogo },
  { label: 'LinkedIn', href: '#contact', Icon: LinkedinLogo },
  { label: 'Twitter', href: '#contact', Icon: TwitterLogo },
]

export function PortfolioHero() {
  return (
    <section
      id="top"
      className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(17rem,0.38fr)_minmax(0,1fr)]">
        <aside className="dorbesh-panel flex flex-col items-center px-6 py-8 text-center sm:px-10 lg:min-h-[45rem] lg:justify-between">
          <div className="w-full">
            <div className="dorbesh-portrait mx-auto">
              <img
                src="/assets/portfolio/hero.jpg"
                alt="Portrait of Drizz"
                className="size-full object-cover object-center"
              />
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-[var(--hq-ink)]">
              {portfolio.name}
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-base leading-7 text-[var(--hq-muted)]">
              Freelance software developer building useful products for real people.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className="grid size-12 place-items-center rounded-xl border border-[var(--hq-line)] text-[var(--hq-ink)] transition hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </aside>

        <div className="grid gap-5">
          <div className="dorbesh-panel flex min-h-[31rem] flex-col justify-between p-8 sm:p-12 lg:p-14">
            <div>
              <p className="text-xl font-medium text-[var(--hq-muted)]">Hello there!</p>
              <h2 className="mt-7 max-w-4xl text-3xl font-extrabold uppercase leading-[1.12] tracking-[-0.045em] text-[var(--hq-ink)] sm:text-4xl lg:text-[3.25rem]">
                I’m <span className="dorbesh-outline">Drizz</span>, a freelance software developer building <span className="dorbesh-outline">user-centred</span> products with pixel-perfect <span className="text-[var(--primary-color)]">care.</span>
              </h2>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
              <span className="dorbesh-availability">
                <span className="size-3 rounded-full bg-[var(--primary-color)]" />
                Available for freelancing
              </span>
              <a href="#work" className="dorbesh-btn">
                Explore my work <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <StatusTicker />
        </div>
      </div>
    </section>
  )
}
