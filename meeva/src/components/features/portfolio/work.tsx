import { ArrowUpRight, FolderSimple } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { portfolio } from '@/config/portfolio'

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <span className="dorbesh-badge mb-3">Works & Projects</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Check out some of my <span className="text-[var(--primary-color)]">Featured Projects</span>
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
          Meticulously crafted with clean architecture, modern interfaces, and high performance.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {portfolio.work.map((item) => {
          const isInternal = 'internal' in item && item.internal
          const hasHref = 'href' in item && item.href

          const content = (
            <div className="dorbesh-card flex flex-col justify-between h-full group cursor-pointer">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/30 px-3 py-1 text-xs font-semibold tracking-wider text-[var(--primary-color)] uppercase">
                    {item.kind}
                  </span>
                  <div className="details-btn">
                    <ArrowUpRight className="size-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--primary-color)] transition-colors">
                  {item.name}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {item.copy}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <FolderSimple className="size-4 text-[var(--primary-color)]" />
                  {isInternal ? 'Internal HQ App' : 'Selected Build'}
                </span>
                <span className="font-semibold text-[var(--primary-color)] group-hover:underline">
                  View Project →
                </span>
              </div>
            </div>
          )

          if (isInternal) {
            return (
              <Link key={item.name} to="/meeva" className="block h-full">
                {content}
              </Link>
            )
          }

          if (hasHref) {
            return (
              <a key={item.name} href={item.href} className="block h-full">
                {content}
              </a>
            )
          }

          return <article key={item.name} className="h-full">{content}</article>
        })}
      </div>
    </section>
  )
}

