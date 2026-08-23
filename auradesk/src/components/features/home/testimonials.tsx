'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { testimonials } from '@/lib/data/seed/home'
import type { Testimonial } from '@/types/home'

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="grow text-sm leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
      <footer className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {testimonial.initials}
        </div>
        <div>
          <cite className="not-italic text-sm font-semibold text-foreground">{testimonial.name}</cite>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </footer>
    </motion.blockquote>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Loved by remote workers everywhere
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Real feedback from people who upgraded their workspace with AuraDesk.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
