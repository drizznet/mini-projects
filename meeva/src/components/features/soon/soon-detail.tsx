import { ArrowSquareOut } from '@phosphor-icons/react'
import { EarlyAccessForm } from '@/components/features/home/early-access-form'
import { CoverField } from '@/components/features/shared/cover-field'
import type { Product } from '@/config/site'
import { productImage } from '@/lib/products'

export function SoonDetail({ product }: { product: Product }) {
  return (
    <article className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
      <div>
        <CoverField
          src={productImage(product)}
          alt=""
          label={product.name}
          className="mb-8 h-56 w-full border border-line"
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
          <p className="text-sm text-soon">{product.status}</p>
        </div>
        <p className="mt-6 text-lg leading-8 text-muted">{product.summary}</p>
        <p className="mt-5 leading-7 text-faint whitespace-pre-line">
          {product.details}
        </p>
        {product.beats ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {product.beats.map(([title, detail]) => (
              <li key={title}>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-faint">{detail}</p>
              </li>
            ))}
          </ul>
        ) : null}
        {product.landingUrl ? (
          <a
            href={product.landingUrl}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            Landing page
            <ArrowSquareOut className="size-4" />
          </a>
        ) : null}
      </div>
      <div className="border border-line bg-raised p-6">
        <h2 className="text-lg font-semibold">Get on the list</h2>
        <p className="mt-2 mb-6 text-sm leading-6 text-muted">
          Request early access, or a note when {product.name} launches.
        </p>
        <EarlyAccessForm product={product} />
      </div>
    </article>
  )
}
