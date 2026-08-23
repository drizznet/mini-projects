'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlist } from '@/components/features/wishlist/wishlist-context'
import { useCart } from '@/components/features/cart/cart-context'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function WishlistSheet() {
  const { items, itemCount, isOpen, setIsOpen, removeItem } = useWishlist()
  const { addItem, openCart } = useCart()

  const handleMoveToCart = (product: (typeof items)[0]) => {
    addItem(product)
    removeItem(product.id)
    setIsOpen(false)
    openCart()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border/40 pb-4 text-left">
          <SheetTitle className="text-lg font-bold">Wishlist</SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? 'Save items you love and come back later.'
              : `${itemCount} saved item${itemCount === 1 ? '' : 's'}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-muted-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Your wishlist is empty</p>
              <p className="text-xs text-muted-foreground">
                Tap the heart on any product to save it here.
              </p>
            </div>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {items.map((product) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-border/60 bg-card p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-accent">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">${product.price.toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground"
                      >
                        <ShoppingBag className="h-3 w-3" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <SheetFooter className="border-t border-border/40 pt-4">
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}
              >
                Continue Shopping
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
