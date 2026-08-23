'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Play, Search, ShoppingBag } from 'lucide-react'

type SlideType = 'search' | 'catalog' | 'social'

interface CarouselSlide {
  id: string
  type: SlideType
  href: string
  brand: string
  brandSuffix?: string
  link: string
  hoverColor: string
  background?: string
  overlay?: string
  gradient?: string
}

const slides: CarouselSlide[] = [
  {
    id: 'standcraft',
    type: 'search',
    href: '/shop',
    brand: 'STANDCRAFT',
    brandSuffix: ':',
    link: 'standcraft.auradesk.com',
    hoverColor: 'bg-[#1a3a34]',
    background:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    overlay: 'from-black/20 via-black/10 to-black/50',
  },
  {
    id: 'auradesk',
    type: 'catalog',
    href: '/shop',
    brand: 'AURADESK',
    link: 'auradesk.com/shop',
    hoverColor: 'bg-[#2a1454]',
    gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
  },
  {
    id: 'beam',
    type: 'social',
    href: '/shop',
    brand: 'BEAM LIGHTING',
    link: 'beam.auradesk.com',
    hoverColor: 'bg-[#3d2c24]',
    background:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    overlay: 'from-black/30 via-transparent to-black/40',
  },
  {
    id: 'ergolab',
    type: 'catalog',
    href: '/shop',
    brand: 'ERGOLAB',
    brandSuffix: ':',
    link: 'ergolab.auradesk.com',
    hoverColor: 'bg-[#1e2a3a]',
    gradient: 'from-slate-700 via-slate-800 to-zinc-900',
  },
  {
    id: 'keycraft',
    type: 'social',
    href: '/shop',
    brand: 'KEYCRAFT',
    link: 'keycraft.auradesk.com',
    hoverColor: 'bg-[#2c2419]',
    background:
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop',
    overlay: 'from-black/40 via-transparent to-black/50',
  },
  {
    id: 'merino',
    type: 'search',
    href: '/shop',
    brand: 'MERINO STUDIO',
    link: 'merino.auradesk.com',
    hoverColor: 'bg-[#3a3a38]',
    background:
      'https://images.unsplash.com/photo-1632292224971-0d45778b3002?q=80&w=800&auto=format&fit=crop',
    overlay: 'from-black/30 via-black/10 to-black/40',
  },
]

function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto w-[148px] overflow-hidden rounded-[1.75rem] border-[3px] border-black/80 bg-black shadow-2xl ring-1 ring-white/10 sm:w-[168px] ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-black/60" />
      <div className="overflow-hidden rounded-[1.4rem] bg-white">{children}</div>
    </div>
  )
}

function SearchMock() {
  return (
    <div className="space-y-2 bg-neutral-100 p-2.5 pt-5 text-left">
      <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 py-1.5">
        <Search className="h-2.5 w-2.5 text-neutral-400" />
        <span className="truncate text-[7px] text-neutral-500">best ergonomic desk chair remote work</span>
      </div>
      <p className="text-[6px] font-semibold text-neutral-400">Sponsored · AuraDesk</p>
      <div className="rounded-lg border border-neutral-200 bg-white p-2">
        <p className="text-[8px] font-bold text-neutral-900">Aura Ergo Chair — 4.8★</p>
        <p className="mt-0.5 text-[6px] text-neutral-500">Dynamic lumbar · breathable mesh</p>
        <div className="mt-1.5 h-10 overflow-hidden rounded-md bg-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=200&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <p className="mt-1 text-[7px] font-bold text-neutral-900">$649 · Free shipping</p>
      </div>
    </div>
  )
}

function CatalogMock() {
  return (
    <div className="space-y-2 bg-white p-2.5 pt-5 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold text-neutral-900">AuraDesk</span>
        <ShoppingBag className="h-3 w-3 text-neutral-700" />
      </div>
      <div className="h-14 overflow-hidden rounded-md bg-neutral-200">
        <img
          src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=200&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-[7px] font-semibold text-neutral-900">Customer favorites</p>
      <div className="grid grid-cols-2 gap-1.5">
        {['Desk Light', 'Desk Pad'].map((label, i) => (
          <div key={label} className="rounded-md bg-neutral-100 p-1">
            <div className="mb-1 h-8 overflow-hidden rounded bg-neutral-200">
              <img
                src={
                  i === 0
                    ? 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=120&auto=format&fit=crop'
                    : 'https://images.unsplash.com/photo-1632292224971-0d45778b3002?q=80&w=120&auto=format&fit=crop'
                }
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-[6px] font-medium text-neutral-800">{label}</p>
            <p className="text-[6px] text-neutral-500">${i === 0 ? '199' : '79'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialMock() {
  return (
    <div className="relative h-[220px] bg-neutral-900 pt-5">
      <div className="absolute inset-x-0 top-0 flex justify-between px-3 pt-2">
        <div className="h-5 w-5 rounded-full bg-white/20" />
        <div className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-0.5 w-6 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=200&auto=format&fit=crop"
        alt=""
        className="h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-[6px] font-bold uppercase tracking-wide text-black">
          Shop setup
        </span>
        <p className="mt-1 text-[7px] font-semibold text-white">Minimalist Linear Keyboard</p>
      </div>
    </div>
  )
}

function SlideVisual({ slide }: { slide: CarouselSlide }) {
  if (slide.type === 'catalog') {
    return (
      <div
        className={`relative flex h-full min-h-[320px] items-center justify-center bg-gradient-to-br sm:min-h-[400px] ${slide.gradient}`}
      >
        <PhoneFrame className="scale-105 transition-transform duration-500 group-hover:scale-100">
          <CatalogMock />
        </PhoneFrame>
      </div>
    )
  }

  if (slide.type === 'search') {
    return (
      <div className="relative h-full min-h-[320px] sm:min-h-[400px]">
        <img src={slide.background} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-b ${slide.overlay}`} />
        <div className="relative flex h-full items-end justify-center p-6 pb-10">
          <PhoneFrame className="transition-transform duration-500 group-hover:translate-y-1">
            <SearchMock />
          </PhoneFrame>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[320px] sm:min-h-[400px]">
      <img src={slide.background} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.overlay}`} />
      <div className="relative flex h-full items-center justify-center p-6">
        <PhoneFrame className="transition-transform duration-500 group-hover:scale-95">
          <SocialMock />
        </PhoneFrame>
      </div>
    </div>
  )
}

function CarouselCard({ slide }: { slide: CarouselSlide }) {
  return (
    <Link
      href={slide.href}
      className="group relative block h-full min-h-[320px] w-[calc(100%-0.5rem)] shrink-0 snap-start overflow-hidden rounded-2xl sm:min-h-[400px] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
    >
      {/* Default visual */}
      <div className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-0 group-focus-visible:opacity-0">
        <SlideVisual slide={slide} />
      </div>

      {/* Hover brand state */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 ${slide.hoverColor}`}
      >
        <p className="px-4 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {slide.brand}
          {slide.brandSuffix && <span className="font-light">{slide.brandSuffix}</span>}
        </p>
        <span className="absolute bottom-6 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          {slide.link}
        </span>
      </div>
    </Link>
  )
}

export default function ShopEverywhereSection() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const updateScrollState = () => {
    const el = carouselRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 8)
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
  }, [])

  const scrollPage = (direction: 1 | -1) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
    window.setTimeout(updateScrollState, 400)
  }

  return (
    <section className="relative mt-4 px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0c0c0c] px-5 py-12 sm:rounded-[2.5rem] sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-left text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]"
        >
          <span className="text-neutral-500">
            Curate your workspace everywhere you create. At home and in the studio.{' '}
          </span>
          <span className="text-white">Across desks, lighting, and seating.</span>{' '}
          <span className="text-neutral-600">Handpicked locally. Delivered globally.</span>
        </motion.h2>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mt-10 sm:mt-12"
        >
          <div
            ref={carouselRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {slides.map((slide) => (
              <CarouselCard key={slide.id} slide={slide} />
            ))}
          </div>

          {/* Carousel controls */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollPage(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollPage(1)}
              disabled={!canScrollNext}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Floating video CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex justify-end md:absolute md:bottom-8 md:right-8 md:mt-0"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1.5 pr-4 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-black/60"
          >
            <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=200&auto=format&fit=crop"
                alt=""
                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-4 w-4 fill-white text-white" />
              </div>
            </div>
            <span className="text-xs font-semibold text-white">Why we build AuraDesk</span>
          </Link>
        </motion.div>

        {/* Category bar */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
          {['Furniture', 'Seating', 'Lighting', 'Gadgets'].map((category) => (
            <Link
              key={category}
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-neutral-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {category}
              <ArrowRight className="h-3 w-3 opacity-60" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
