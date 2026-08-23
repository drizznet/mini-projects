'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/components/features/wishlist/wishlist-context'

export function WishlistButton({
  className,
  onClick,
  itemCount,
}: {
  className?: string
  onClick: () => void
  itemCount: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open wishlist with ${itemCount} items`}
      className={className}
    >
      <Heart className="h-4 w-4" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-primary-foreground">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
