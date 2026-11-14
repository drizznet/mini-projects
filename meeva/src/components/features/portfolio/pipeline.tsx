import { portfolio } from '@/config/portfolio'

export function Pipeline() {
  return (
    <section id="process" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <span className="dorbesh-badge mb-3">Work Process</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          How I Bring Your <span className="text-[var(--primary-color)]">Vision to Life</span>
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
          A structured 4-step development workflow focused on clarity, execution, and long-term stability.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {portfolio.pipeline.map((item) => (
          <div
            key={item.step}
            className="dorbesh-card flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-[var(--primary-color)] opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.step}
                </span>
                <span className="size-2.5 rounded-full bg-[var(--primary-color)]/30 group-hover:bg-[var(--primary-color)] transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--primary-color)] transition-colors">
                {item.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                {item.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

