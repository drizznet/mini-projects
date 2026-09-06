import { products, type Product } from '@/config/site'

export function getLiveProducts(): Product[] {
  return products.filter((product) => product.status === 'Live')
}

export function getSoonProducts(): Product[] {
  return products.filter((product) => product.status === 'Coming soon')
}

export function getLiveBySlug(slug: string): Product | undefined {
  return getLiveProducts().find((product) => product.slug === slug)
}

export function getSoonBySlug(slug: string): Product | undefined {
  return getSoonProducts().find((product) => product.slug === slug)
}

export function productImage(product: Product) {
  return product.image ?? `/assets/products/${product.slug}.jpg`
}

export function pageScreen(slug: 'marketplace' | 'soon') {
  return `/assets/screens/${slug}.jpg`
}

export function getMarqueeScreens() {
  return [
    {
      slug: 'marketplace',
      label: 'Marketplace',
      src: pageScreen('marketplace'),
    },
    { slug: 'soon', label: 'Coming soon', src: pageScreen('soon') },
    ...products.map((product) => ({
      slug: product.slug,
      label: product.name,
      src: productImage(product),
    })),
  ]
}
