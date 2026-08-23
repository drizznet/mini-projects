'use client'

import type { ProductCategory } from '@/types/product'

const categories: Array<ProductCategory | 'All'> = [
  'All',
  'Furniture',
  'Seating',
  'Lighting',
  'Gadgets',
]

type ShopFiltersProps = {
  searchQuery: string
  selectedCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  variant?: 'sidebar' | 'mobile'
}

export function ShopFilters({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  variant = 'sidebar',
}: ShopFiltersProps) {
  if (variant === 'mobile') {
    return (
      <div className="flex w-full items-center gap-2 sm:w-auto lg:hidden">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none"
        />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="hidden space-y-6 text-left lg:block">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Search</h3>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Filter products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Categories</h3>
        <div className="mt-2 space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-accent font-semibold text-foreground'
                  : 'text-foreground/75 hover:bg-accent/40 hover:text-foreground'
              }`}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
