'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, FileImage, ShieldCheck, ShoppingCart, DollarSign, Package } from 'lucide-react'

export default function AdminDashboardPage() {
  const stats = [
    { name: 'Total Revenue', value: '$12,480.00', icon: <DollarSign className="h-5 w-5 text-emerald-500" /> },
    { name: 'Orders Processed', value: '18', icon: <ShoppingCart className="h-5 w-5 text-blue-500" /> },
    { name: 'Active Catalog Items', value: '6', icon: <Package className="h-5 w-5 text-purple-500" /> },
  ]

  return (
    <div className="flex-1 bg-background py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="border-b border-border/40 pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Security clearance: Admin
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            AuraDesk Control Center
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            System metrics, inventory management, and asset uploads.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
          {stats.map((stat) => (
            <div key={stat.name} className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.name}</p>
                {stat.icon}
              </div>
              <p className="mt-2 text-2xl font-extrabold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Upload block */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileImage className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Asset Bucket Manager</h3>
              <p className="text-sm text-muted-foreground">
                First-feature tool designed to upload site images, furniture assets, and tech graphics to the AuraDesk cloud bucket. Returns copyable CDN paths for developer use.
              </p>
            </div>
            <Link
              href="/admin/assets"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-95 mt-4"
            >
              Open Asset Manager
            </Link>
          </div>

          {/* System status block */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Next.js Dev Server Console</h3>
              <p className="text-sm text-muted-foreground">
                Monitor performance metrics, hydration status, active sessions, and verify server-side generation rules for catalog layouts.
              </p>
            </div>
            <div className="text-xs border border-border bg-accent/40 rounded p-3 font-mono text-muted-foreground mt-4">
              <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Next.js Compiler: Active
              </p>
              <p>Typegen: OK</p>
              <p>Active Routes: / | /shop | /admin | /admin/assets</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
