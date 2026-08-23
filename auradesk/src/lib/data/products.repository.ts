import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { productsSeed } from '@/lib/data/seed/products'
import type { Product } from '@/types/product'

/**
 * Data access layer for products.
 * Today: static seed. Tomorrow: uncomment the API call.
 */
export async function getProducts(): Promise<Product[]> {
  // return apiClient.get<Product[]>(endpoints.products.list)
  return productsSeed
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find((product) => product.id === id)
}

/** Sync helper for client components until data is fully async. */
export function getProductsSync(): Product[] {
  return productsSeed
}
