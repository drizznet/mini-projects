'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { siteConfig } from '@/config/site'
import type { Product } from '@/types/product'

interface WishlistContextType {
  items: Product[]
  itemCount: number
  isOpen: boolean
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isWishlisted: (productId: string) => boolean
  openWishlist: () => void
  closeWishlist: () => void
  setIsOpen: (open: boolean) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(siteConfig.wishlistStorageKey)
      if (saved) setItems(JSON.parse(saved) as Product[])
    } catch {
      setItems([])
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(siteConfig.wishlistStorageKey, JSON.stringify(items))
  }, [items, mounted])

  const addItem = (product: Product) => {
    setItems((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]))
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const toggleItem = (product: Product) => {
    setItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    )
  }

  const isWishlisted = (productId: string) => items.some((item) => item.id === productId)

  const itemCount = useMemo(() => items.length, [items])

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        isOpen,
        addItem,
        removeItem,
        toggleItem,
        isWishlisted,
        openWishlist: () => setIsOpen(true),
        closeWishlist: () => setIsOpen(false),
        setIsOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
