'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { getProductsSync } from '@/lib/data/products.repository'
import { ShopFilters } from '@/components/features/shop/shop-filters'
import { ProductGrid } from '@/components/features/shop/product-grid'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating'

export default function ShopPage() {
  const products = getProductsSync()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)

    return result
  }, [products, selectedCategory, sortBy, searchQuery])

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border/40 pb-6 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Workspace Collection
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enhance your concentration and ergonomics with our professional workspace layout gear.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          <ShopFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
          />

          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
              <ShopFilters
                variant="mobile"
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
              />
              <div className="ml-auto flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden text-xs text-muted-foreground sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-md border border-border bg-card px-2 py-1.5 text-xs font-medium text-foreground focus:outline-none"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}
