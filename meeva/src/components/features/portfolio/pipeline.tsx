import { portfolio } from '@/config/portfolio'

export function Pipeline() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.28em] text-dz-blue uppercase">
        <span className="size-1.5 rounded-full bg-dz-blue" />
        Development pipeline
      </p>
      <h2 className="mt-4 text-center text-4xl font-bold tracking-tight uppercase sm:text-5xl">
        How I bring your <span className="dz-vision">vision</span> to life
      </h2>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {portfolio.pipeline.map((item) => (
          <li
            key={item.step}
            className="rounded-2xl border border-white/10 bg-surface p-5"
          >
            <p className="text-xs font-bold tracking-[0.2em] text-dz-cyan">
              {item.step}
            </p>
            <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{item.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
