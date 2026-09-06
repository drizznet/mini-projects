import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { SoonCard } from '@/components/features/soon/soon-card'
import { easeOut } from '@/lib/motion'
import { getSoonProducts } from '@/lib/products'

export const Route = createFileRoute('/soon/')({
  component: SoonPage,
})

function SoonPage() {
  const soon = getSoonProducts()

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="text-xs tracking-[0.28em] text-faint uppercase">
        Coming soon
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
        What’s next
      </h1>
      <p className="mt-5 max-w-xl leading-7 text-muted">
        Share this page. People can read what an upcoming product is, visit its
        landing page if one exists, and request early access or a launch note.
      </p>
      {soon.length === 0 ? (
        <p className="mt-12 border border-dashed border-line px-5 py-10 text-muted">
          No upcoming products listed yet. Add one when you want people on the
          list.
        </p>
      ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {soon.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
            >
              <SoonCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
