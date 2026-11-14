import { ArrowUpRight, EnvelopeSimple, MapPin, Sparkle } from '@phosphor-icons/react'
import { portfolio } from '@/config/portfolio'

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="dorbesh-card relative overflow-hidden bg-gradient-to-br from-[var(--hq-surface)] to-[var(--hq-surface-raised)] p-8 sm:p-12 lg:p-16 border border-[var(--hq-line-strong)]">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-[var(--primary-color)]/10 blur-3xl pointer-events-none" />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center relative z-10">
          <div>
            <span className="dorbesh-badge mb-4">
              <Sparkle className="size-4 text-[var(--primary-color)]" />
              Contact & Inquiries
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Are You Ready to kickstart your project with a <span className="text-[var(--primary-color)]">touch of magic?</span>
            </h2>

            <p className="mt-4 text-slate-300 text-base leading-relaxed max-w-2xl">
              Reach out and let’s make it happen ✨. Open for full-time or contract opportunities to push the boundaries of design and deliver exceptional engineering.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <EnvelopeSimple className="size-5 text-[var(--primary-color)]" />
                <a href={`mailto:${portfolio.email}`} className="font-medium hover:text-white transition-colors">
                  {portfolio.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="size-5 text-[var(--primary-color)]" />
                <span className="font-medium">Available Worldwide (Remote)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end justify-center">
            <a
              href={`mailto:${portfolio.email}`}
              className="dorbesh-btn py-4 px-8 text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              <span>Let’s Talk ✨</span>
              <ArrowUpRight className="size-5" />
            </a>
            <p className="mt-3 text-xs text-slate-400 font-medium">
              Direct response within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

