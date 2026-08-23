'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, ShoppingBag, X } from 'lucide-react'
import { siteConfig } from '@/config/site'
import ThemeSelector from '@/components/features/theme/theme-selector'
import { CartButton } from '@/components/features/cart/cart-button'
import CartSheet from '@/components/features/cart/cart-sheet'
import { useCart } from '@/components/features/cart/cart-context'
import { WishlistButton } from '@/components/features/wishlist/wishlist-button'
import { WishlistSheet } from '@/components/features/wishlist/wishlist-sheet'
import { useWishlist } from '@/components/features/wishlist/wishlist-context'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount: cartCount, openCart } = useCart()
  const { itemCount: wishlistCount, openWishlist } = useWishlist()

  const navLinks = [
    { href: siteConfig.routes.home, label: 'Home' },
    { href: siteConfig.routes.shop, label: 'Shop' },
    { href: siteConfig.routes.adminAssets, label: 'Admin Panel' },
  ]

  const iconButtonClass =
    'relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground'

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={siteConfig.routes.home}
            className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-foreground/90"
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-1 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'font-semibold text-foreground'
                      : 'text-foreground/75 hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex md:gap-3">
            <WishlistButton
              onClick={openWishlist}
              itemCount={wishlistCount}
              className={iconButtonClass}
            />
            <CartButton onClick={openCart} itemCount={cartCount} className={iconButtonClass} />
            <ThemeSelector />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <WishlistButton
              onClick={openWishlist}
              itemCount={wishlistCount}
              className={iconButtonClass}
            />
            <CartButton onClick={openCart} itemCount={cartCount} className={iconButtonClass} />
            <ThemeSelector />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={iconButtonClass}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-background md:hidden"
            >
              <div className="space-y-1 px-4 pb-4 pt-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-accent font-semibold text-foreground'
                          : 'text-foreground/75 hover:bg-accent/50 hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <div className="my-2 h-px bg-border" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-foreground/75">Wishlist</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openWishlist()
                    }}
                    className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    {wishlistCount} Saved
                  </button>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-foreground/75">Cart</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openCart()
                    }}
                    className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {cartCount} Item{cartCount === 1 ? '' : 's'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CartSheet />
      <WishlistSheet />
    </>
  )
}
