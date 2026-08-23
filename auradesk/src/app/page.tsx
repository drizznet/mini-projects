'use client'

import { getProductsSync } from '@/lib/data/products.repository'
import { HeroSection } from '@/components/features/home/hero-section'
import { TrustBadges } from '@/components/features/home/trust-badges'
import { FeaturedProducts } from '@/components/features/home/featured-products'
import { WhyChooseUs } from '@/components/features/home/why-choose-us'
import { Testimonials } from '@/components/features/home/testimonials'
import ShopEverywhereSection from '@/components/features/home/shop-everywhere-section'

export default function HomePage() {
  const featuredProducts = getProductsSync().slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <HeroSection />
      <TrustBadges />
      <FeaturedProducts products={featuredProducts} />
      <WhyChooseUs />
      <Testimonials />
      <ShopEverywhereSection />
    </div>
  )
}
