'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Laptop, Sparkles } from 'lucide-react'
import { siteConfig } from '@/config/site'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-8 text-left lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-foreground/80 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-500" />
              <span>Rethink your remote environment</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl"
            >
              Tools built for the{' '}
              <span className="text-primary underline decoration-primary/30 decoration-2 underline-offset-8">
                modern home
              </span>{' '}
              workspace.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Aesthetic desks, lighting, gadgets, and ergonomic seating carefully curated to keep you
              inspired, focused, and comfortable while working from home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href={siteConfig.routes.shop}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:translate-x-0.5 hover:opacity-95"
              >
                Explore Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={siteConfig.routes.adminAssets}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent"
              >
                Admin Asset Manager
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
            className="flex justify-center lg:col-span-5 lg:justify-end"
          >
            <div className="relative w-full max-w-[420px] rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-sm">
              <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                <Laptop className="h-5 w-5" />
              </div>
              <div className="space-y-4">
                <div className="h-48 overflow-hidden rounded-xl bg-accent">
                  <img
                    src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600&auto=format&fit=crop"
                    alt="Modern aesthetic desk setup"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Featured System</h3>
                  <p className="text-xs text-muted-foreground">
                    An integrated ecosystem of solid oak, dimmable smart lighting, and ergonomic
                    support built to reduce physical strain and elevate focus.
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-foreground">{siteConfig.name} setup</div>
                  <Link
                    href={siteConfig.routes.shop}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Shop Setup <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
