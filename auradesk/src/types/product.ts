export type ProductCategory = 'Furniture' | 'Seating' | 'Lighting' | 'Gadgets'

export interface Product {
  id: string
  name: string
  price: number
  category: ProductCategory
  rating: number
  reviewsCount: number
  description: string
  image: string
  features: string[]
  specs: Record<string, string>
}
