'use client'

import { useState } from 'react'
import { Check, ShoppingBag, Star } from 'lucide-react'
import type { Product } from '@/types/product'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/components/features/cart/cart-context'

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem, openCart } = useCart()
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  const handleAddToCart = (product: Product) => {
    addItem(product)
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 2000)
    openCart()
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showWishlist
          linkToShop={false}
          footer={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-300 ${
                  addedProductId === product.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary text-primary-foreground hover:opacity-95'
                }`}
              >
                {addedProductId === product.id ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          }
        />
      ))}
    </div>
  )
}
