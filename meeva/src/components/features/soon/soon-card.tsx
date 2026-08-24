import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { CoverField } from '@/components/features/shared/cover-field'
import type { Product } from '@/config/site'
import { easeOut } from '@/lib/motion'
import { productImage } from '@/lib/products'

export function SoonCard({ product }: { product: Product }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="flex flex-col overflow-hidden border border-line bg-raised"
    >
      <CoverField
        src={productImage(product)}
        alt=""
        className="h-52 w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">
            {product.category}
          </p>
          <p className="text-sm text-soon">{product.status}</p>
        </div>
        <h2 className="mt-4 font-display text-3xl italic">
          {product.name}{' '}
          <span className="font-sans text-lg not-italic text-muted">
            {product.byline}
          </span>
        </h2>
        <p className="mt-3 flex-1 leading-7 text-muted">{product.summary}</p>
        <Link
          to="/soon/$slug"
          params={{ slug: product.slug }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent"
        >
          Details and early access
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </motion.article>
  )
}
