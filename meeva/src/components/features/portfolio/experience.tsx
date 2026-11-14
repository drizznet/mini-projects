import { Link } from '@tanstack/react-router'
import { portfolio } from '@/config/portfolio'

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <span className="dorbesh-badge mb-3">Experience</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Work Experience & <span className="text-[var(--primary-color)]">Career History</span>
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
          Building and shipping software products, client applications, and founder projects.
        </p>
      </div>

      <div className="relative mt-14 space-y-8 pl-6 sm:pl-10">
        <span
          aria-hidden
          className="dz-timeline-line absolute top-3 bottom-3 left-2 sm:left-3.5 w-0.5"
        />

        {portfolio.experience.map((job) => (
          <div key={job.role + job.org} className="relative group">
            <span
              aria-hidden
              className="dz-node-emerald absolute top-6 -left-6 sm:-left-[2.15rem] size-4 rounded-full border-4 border-[var(--hq-canvas)] transition-transform group-hover:scale-125"
            />

            <article className="dorbesh-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[var(--primary-color)] transition-colors">
                    {job.role}{' '}
                    {'href' in job && job.href === '/meeva' ? (
                      <Link
                        to="/meeva"
                        className="text-[var(--primary-color)] hover:underline"
                      >
                        {job.org}
                      </Link>
                    ) : 'href' in job && job.href ? (
                      <a
                        href={job.href}
                        className="text-[var(--primary-color)] hover:underline"
                      >
                        {job.org}
                      </a>
                    ) : (
                      <span className="text-[var(--primary-color)]">{job.org}</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {job.industry}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                  {job.dates}
                </span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-white/10 text-sm text-slate-300">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--primary-color)]" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

