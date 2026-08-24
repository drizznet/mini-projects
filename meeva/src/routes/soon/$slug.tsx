import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { SoonDetail } from '@/components/features/soon/soon-detail'
import { getSoonBySlug } from '@/lib/products'

export const Route = createFileRoute('/soon/$slug')({
  loader: ({ params }) => {
    const product = getSoonBySlug(params.slug)
    if (!product) throw notFound()
    return product
  },
  component: SoonProductPage,
  notFoundComponent: SoonMissing,
})

function SoonProductPage() {
  const product = Route.useLoaderData()
  return (
    <>
      <p className="mx-auto max-w-6xl px-5 pt-8 text-sm lg:px-8">
        <Link to="/soon" className="text-muted hover:text-ink">
          ← Coming soon
        </Link>
      </p>
      <SoonDetail product={product} />
    </>
  )
}

function SoonMissing() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <h1 className="text-3xl font-semibold">This launch is not listed</h1>
      <Link to="/soon" className="mt-6 inline-block text-sm text-accent">
        Back to coming soon
      </Link>
    </section>
  )
}
