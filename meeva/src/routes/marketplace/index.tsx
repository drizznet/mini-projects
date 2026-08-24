import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/features/marketplace/product-card'
import { easeOut } from '@/lib/motion'
import { getLiveProducts } from '@/lib/products'

export const Route = createFileRoute('/marketplace/')({
  component: MarketplacePage,
})

function MarketplacePage() {
  const live = getLiveProducts()

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="text-xs tracking-[0.28em] text-accent uppercase">
        Marketplace
      </p>
      <h1 className="mt-4 font-display text-5xl italic sm:text-6xl">
        Live products
      </h1>
      <p className="mt-5 max-w-xl leading-7 text-muted">
        Everything here is ready to use. Open a product to read the details
        before you go to the app.
      </p>
      {live.length === 0 ? (
        <p className="mt-12 border border-dashed border-line px-5 py-10 text-muted">
          Nothing in the store yet. Live products will appear here when you add
          them.
        </p>
      ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {live.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
