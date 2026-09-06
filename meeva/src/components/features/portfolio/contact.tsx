import { ArrowUpRight } from '@phosphor-icons/react'
import { portfolio } from '@/config/portfolio'

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
        Open to freelance and contract. Tell me what you need built.
      </p>
      <a
        href={`mailto:${portfolio.email}`}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-dz-green px-5 py-3 text-sm font-bold tracking-wide text-black uppercase"
      >
        {portfolio.email}
        <ArrowUpRight className="size-4" />
      </a>
    </section>
  )
}
