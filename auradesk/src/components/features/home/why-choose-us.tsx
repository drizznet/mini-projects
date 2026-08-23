'use client'

import { motion } from 'framer-motion'
import { Gem, Headphones, Palette, Truck } from 'lucide-react'
import { whyChooseUsItems } from '@/lib/data/seed/home'
import type { WhyChooseUsItem } from '@/types/home'

const iconMap = {
  design: Palette,
  quality: Gem,
  support: Headphones,
  delivery: Truck,
} as const

function WhyChooseUsCard({ item, index }: { item: WhyChooseUsItem; index: number }) {
  const Icon = iconMap[item.icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
    </motion.div>
  )
}

export function WhyChooseUs() {
  return (
    <section className="border-y border-border/40 bg-card/20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Why Choose Us</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            A workspace store that actually gets it
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We obsess over the details so your desk, chair, and gear work together — not against you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUsItems.map((item, index) => (
            <WhyChooseUsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
