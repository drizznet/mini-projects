'use client'

import { CartProvider } from '@/components/features/cart/cart-context'
import { ThemeProvider } from '@/components/features/theme/theme-context'
import { WishlistProvider } from '@/components/features/wishlist/wishlist-context'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  )
}
