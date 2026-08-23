'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types/product'
import { WishlistToggle } from '@/components/features/wishlist/wishlist-toggle'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

type ProductCardProps = {
  product: Product
  className?: string
  showWishlist?: boolean
  linkToShop?: boolean
  footer?: React.ReactNode
}

export function ProductCard({
  product,
  className,
  showWishlist = false,
  linkToShop = true,
  footer,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      <div className="relative w-full overflow-hidden bg-accent lg:h-56">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] lg:h-full lg:w-full"
        />
        {showWishlist && (
          <div className="absolute right-3 top-3 z-10">
            <WishlistToggle product={product} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {product.category}
            </span>
            <h3 className="mt-0.5 text-sm font-semibold text-foreground">
              {linkToShop ? (
                <Link href={siteConfig.routes.shop}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              ) : (
                product.name
              )}
            </h3>
          </div>
          <p className="text-sm font-bold text-foreground">${product.price}</p>
        </div>
        <p className="line-clamp-2 flex-grow text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="h-px bg-border" />
        {footer ?? (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              ★ {product.rating} ({product.reviewsCount} reviews)
            </span>
            {linkToShop && (
              <span className="flex items-center gap-0.5 font-semibold text-primary group-hover:underline">
                View Product <ArrowRight className="h-3 w-3" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
