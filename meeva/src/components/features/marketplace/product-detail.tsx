import { ArrowRight, ArrowSquareOut } from '@phosphor-icons/react'
import { CoverField } from '@/components/features/shared/cover-field'
import type { Product } from '@/config/site'
import { productImage } from '@/lib/products'

export function ProductDetail({ product }: { product: Product }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <CoverField
        src={productImage(product)}
        alt=""
        label={product.name}
        className="mb-10 h-64 w-full border border-line"
      />
      <p className="text-xs tracking-[0.22em] text-faint uppercase">
        {product.category}
      </p>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          {product.name}{' '}
          <span className="text-xl font-normal text-muted">
            {product.byline}
          </span>
        </h1>
        <p className="text-sm text-live">{product.status}</p>
      </div>
      <p className="mt-6 text-lg leading-8 text-muted">{product.summary}</p>
      <p className="mt-5 leading-7 text-faint whitespace-pre-line">
        {product.details}
      </p>
      {product.beats ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {product.beats.map(([title, detail]) => (
            <li key={title}>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-faint">{detail}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-10 flex flex-wrap gap-4">
        {product.accessUrl ? (
          <a
            href={product.accessUrl}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas"
          >
            Open {product.name}
            <ArrowRight className="size-4" />
          </a>
        ) : null}
        {product.landingUrl ? (
          <a
            href={product.landingUrl}
            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            Product landing page
            <ArrowSquareOut className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  )
}
