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
