import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { CoverField } from '@/components/features/shared/cover-field'
import type { Product } from '@/config/site'
import { easeOut } from '@/lib/motion'
import { productImage } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="flex flex-col overflow-hidden border border-line bg-raised"
    >
      <CoverField
        src={productImage(product)}
        alt=""
        label={product.name}
        className="h-52 w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs tracking-[0.18em] text-faint uppercase">
            {product.category}
          </p>
          <p className="text-sm text-live">{product.status}</p>
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">
          {product.name}{' '}
          <span className="text-lg font-normal text-muted">
            {product.byline}
          </span>
        </h2>
        <p className="mt-3 flex-1 leading-7 text-muted">{product.summary}</p>
        <Link
          to="/marketplace/$slug"
          params={{ slug: product.slug }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
        >
          View details
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </motion.article>
  )
}
