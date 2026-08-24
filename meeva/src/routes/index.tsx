import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/features/home/hero-section'

export const Route = createFileRoute('/')({ component: HeadquartersHome })

function HeadquartersHome() {
  return <HeroSection />
}
