import { getProducts } from '@/lib/data/products.repository'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}
