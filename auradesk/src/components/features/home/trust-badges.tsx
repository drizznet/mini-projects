import { Laptop, RefreshCw, Shield } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: '5-Year Desk Warranty',
    description: 'Built to last, guaranteed.',
    align: 'sm:justify-start',
  },
  {
    icon: RefreshCw,
    title: '30-Day Workspace Trial',
    description: "Return it if it doesn't fit your space.",
    align: 'sm:justify-center',
  },
  {
    icon: Laptop,
    title: 'Curated Design First',
    description: 'Sourced directly from aesthetic craft makers.',
    align: 'sm:justify-end',
  },
] as const

export function TrustBadges() {
  return (
    <section className="border-y border-border/40 bg-card/30 py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
          {badges.map(({ icon: Icon, title, description, align }) => (
            <div
              key={title}
              className={`flex flex-col items-center gap-3 justify-center ${align}`}
            >
              <Icon className="h-6 w-6 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
