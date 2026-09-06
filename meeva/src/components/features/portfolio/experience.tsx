import { Link } from '@tanstack/react-router'
import { portfolio } from '@/config/portfolio'

export function Experience() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Experience
      </h2>
      <ol className="relative mt-14 space-y-14 pl-8">
        <span
          aria-hidden
          className="dz-timeline absolute top-2 bottom-2 left-[7px] w-px"
        />
        {portfolio.experience.map((job) => (
          <li key={job.role + job.org} className="relative">
            <span aria-hidden className="dz-node absolute top-1.5 -left-8 size-4 rounded-full" />
            <h3 className="text-xl font-semibold sm:text-2xl">
              {job.role}{' '}
              {job.href === '/meeva' ? (
                <Link
                  to="/meeva"
                  className="text-dz-cyan underline decoration-dotted underline-offset-4"
                >
                  {job.org}
                </Link>
              ) : job.href ? (
                <a
                  href={job.href}
                  className="text-dz-cyan underline decoration-dotted underline-offset-4"
                >
                  {job.org}
                </a>
              ) : (
                <span className="text-dz-cyan">{job.org}</span>
              )}
            </h3>
            <p className="mt-1 text-sm text-faint">
              {job.dates} · {job.industry}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-white/85">
              {job.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-white" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
