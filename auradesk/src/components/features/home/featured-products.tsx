'use client'

import { motion } from 'framer-motion'
import type { Product } from '@/types/product'
import { ProductCard } from '@/components/product-card'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 space-y-2 text-left">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Featured Ambience Gear
        </h2>
        <p className="text-sm text-muted-foreground">
          A hand-selected collection of our most requested desk tools.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} showWishlist />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
