'use client'

import { ShoppingBag } from 'lucide-react'

export function CartButton({
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
      aria-label={`Open cart with ${itemCount} items`}
      className={className}
    >
      <ShoppingBag className="h-4 w-4" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-primary-foreground">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
