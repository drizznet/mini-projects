import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ProductDetail } from '@/components/features/marketplace/product-detail'
import { getLiveBySlug } from '@/lib/products'

export const Route = createFileRoute('/marketplace/$slug')({
  loader: ({ params }) => {
    const product = getLiveBySlug(params.slug)
    if (!product) throw notFound()
    return product
  },
  component: MarketplaceProductPage,
  notFoundComponent: ProductMissing,
})

function MarketplaceProductPage() {
  const product = Route.useLoaderData()
  return (
    <>
      <p className="mx-auto max-w-3xl px-5 pt-8 text-sm lg:px-8">
        <Link to="/marketplace" className="text-muted hover:text-ink">
          ← Marketplace
        </Link>
      </p>
      <ProductDetail product={product} />
    </>
  )
}

function ProductMissing() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <h1 className="text-3xl font-semibold">This product is not in the store</h1>
      <Link to="/marketplace" className="mt-6 inline-block text-sm underline underline-offset-4">
        Back to marketplace
      </Link>
    </section>
  )
}
