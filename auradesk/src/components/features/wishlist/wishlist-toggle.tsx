'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/components/features/wishlist/wishlist-context'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'

export function WishlistToggle({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  const { isWishlisted, toggleItem } = useWishlist()
  const active = isWishlisted(product.id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-foreground',
        active && 'border-primary/30 bg-primary/10 text-primary',
        className
      )}
    >
      <Heart className={cn('h-3.5 w-3.5', active && 'fill-current')} />
    </button>
  )
}
